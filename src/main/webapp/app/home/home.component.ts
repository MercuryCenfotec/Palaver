import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import {LoginModalService, AccountService, Account, UserService} from 'app/core';
import {UserAppService} from "app/entities/user-app";
import {Router} from "@angular/router";

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;

    constructor(
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private userService: UserService,
        private userAppService: UserAppService,
        private router: Router
    ) {}

    ngOnInit() {
        this.accountService.identity().then((account: Account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.userAppService.findByUserId(user.id).subscribe(userApp => {
                        switch (userApp.rol) {
                            case 'institution':
                                this.router.navigate(['/dashboard-institution']);
                                break;
                            case 'participant':
                                this.router.navigate(['/participant-home']);
                                break;
                            default:
                                break;
                        }

                });
            });
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.accountService.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
