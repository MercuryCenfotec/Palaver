import { Component, ElementRef, OnInit, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { LoginService, StateStorageService } from 'app/core';
import { FocusGroupService } from 'app/entities/focus-group/focus-group.service';

@Component({
    selector: 'jhi-focus-group-management-login',
    templateUrl: './focus-group-management-login.component.html'
})
export class FocusGroupManagementLoginComponent implements OnInit {
    authenticationError: boolean;
    password: string;
    rememberMe: boolean;
    username: string;
    code: string;
    credentials: any;

    constructor(
        private eventManager: JhiEventManager,
        private loginService: LoginService,
        private stateStorageService: StateStorageService,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private router: Router,
        private focusGroupService: FocusGroupService
    ) {
        this.credentials = {};
    }

    ngOnInit(): void {}

    login() {
        this.password = this.code;
        this.username = this.code;
        this.focusGroupService.getByCode(this.code).subscribe(data => {
            this.loginService
                .login({
                    username: this.username,
                    password: this.password,
                    rememberMe: this.rememberMe
                })
                .then(() => {
                    this.authenticationError = false;
                    if (this.router.url === '/register' || /^\/activate\//.test(this.router.url) || /^\/reset\//.test(this.router.url)) {
                        this.router.navigate(['/focus-group/management']);
                    }

                    this.eventManager.broadcast({
                        name: 'authenticationSuccess',
                        content: 'Sending Authentication Success'
                    });

                    // previousState was set in the authExpiredInterceptor before being redirected to login modal.
                    // since login is successful, go to stored previousState and clear previousState
                    const redirect = this.stateStorageService.getUrl();
                    if (redirect) {
                        this.stateStorageService.storeUrl(null);
                        this.router.navigate([redirect]);
                    }
                })
                .catch(() => {
                    this.authenticationError = true;
                });
        });
    }
}
