import { Component, OnInit, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/shared';
import { LoginModalService } from 'app/core';
import { Register } from 'app/account/register/register.service';
import { UserApp } from 'app/shared/model/user-app.model';

@Component({
    selector: 'jhi-subadmin-form',
    templateUrl: './subadmin-form.component.html'
})
export class SubadminFormComponent implements OnInit, AfterViewInit {
    confirmPassword: string;
    doNotMatch: string;
    error: string;
    errorEmailExists: string;
    errorUserExists: string;
    registerAccount: any;
    userApp: UserApp;
    success: boolean;
    modalRef: NgbModalRef;

    constructor(
        private loginModalService: LoginModalService,
        private registerService: Register,
        private elementRef: ElementRef,
        private renderer: Renderer
    ) {}

    ngOnInit() {
        this.success = false;
        this.registerAccount = {};
        this.userApp = new UserApp(null, '', '', '', '', '', null);
        this.userApp.rol = 'subadmin';
    }

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#login'), 'focus', []);
    }

    register() {
        if (this.registerAccount.password !== this.confirmPassword) {
            this.doNotMatch = 'ERROR';
        } else {
            this.doNotMatch = null;
            this.error = null;
            this.errorUserExists = null;
            this.errorEmailExists = null;
            this.registerAccount.langKey = 'en';
            const radioChoice = <HTMLInputElement>document.getElementById('customRadioInline1');
            this.registerAccount.authorities = [];
            this.registerAccount.authorities.push(radioChoice.value);
            this.registerService.saveRetrieve(this.registerAccount).subscribe(
                data => {
                    this.userApp.user = data;
                    this.registerService.saveUserApp(this.userApp).subscribe(() => {
                        this.success = true;
                    });
                },
                response => this.processError(response)
            );
        }
    }

    openLogin() {
        this.modalRef = this.loginModalService.open();
    }

    private processError(response: HttpErrorResponse) {
        this.success = null;
        if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
            this.errorUserExists = 'ERROR';
        } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
            this.errorEmailExists = 'ERROR';
        } else {
            this.error = 'ERROR';
        }
    }

    setRole(rol: string) {
        this.userApp.rol = rol;
    }

    previousState() {
        window.history.back();
    }
}
