import { Component, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { LoginService } from 'app/core/login/login.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { UserAppService } from 'app/entities/user-app';
import { UserService } from 'app/core';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { INotification } from 'app/shared/model/notification.model';
import { NotificationService } from 'app/entities/notification';

@Component({
    selector: 'jhi-login-modal',
    templateUrl: './login.component.html'
})
export class JhiLoginModalComponent implements AfterViewInit {
    authenticationError: boolean;
    password: string;
    rememberMe: boolean;
    username: string;
    credentials: any;
    userNotifications: INotification[];

    constructor(
        private eventManager: JhiEventManager,
        private loginService: LoginService,
        private stateStorageService: StateStorageService,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private router: Router,
        public activeModal: NgbActiveModal,
        public userAppService: UserAppService,
        protected userService: UserService,
        protected notificationService: NotificationService
    ) {
        this.credentials = {};
    }

    ngAfterViewInit() {
        setTimeout(() => this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#username'), 'focus', []), 0);
    }

    cancel() {
        this.credentials = {
            username: null,
            password: null,
            rememberMe: true
        };
        this.authenticationError = false;
        this.activeModal.dismiss('cancel');
    }

    login() {
        this.loginService
            .login({
                username: this.username,
                password: this.password,
                rememberMe: this.rememberMe
            })
            .then(() => {
                this.authenticationError = false;
                this.activeModal.dismiss('login success');

                this.userService.getUserWithAuthorities().subscribe(user => {
                    this.userAppService.findByUserId(user.id).subscribe(userApp => {
                        this.userAppService.isSpecified(user.id).subscribe(isSpecified => {
                            if (!isSpecified.body) {
                                switch (userApp.rol) {
                                    case 'institution':
                                        this.router.navigate(['/institution/new']);
                                        break;
                                    case 'participant':
                                        this.router.navigate(['/participant/new']);
                                        break;
                                    case 'admin':
                                        this.router.navigate(['dashboard-admin']);
                                        break;
                                    case 'subadmin':
                                        this.router.navigate(['ban']);
                                        break;
                                }
                            } else {
                                switch (userApp.rol) {
                                    case 'institution':
                                        this.router.navigate(['/dashboard-institution']);
                                        break;
                                    case 'participant':
                                        this.findMe(user.id);
                                        this.router.navigate(['/participant-home']);
                                        break;
                                    case 'admin':
                                        this.router.navigate(['/dashboard-admin']);
                                        break;
                                    case 'subadmin':
                                        this.router.navigate(['/ban']);
                                        break;
                                }
                            }
                        });
                    });
                });

                if (this.router.url === '/register' || /^\/activate\//.test(this.router.url) || /^\/reset\//.test(this.router.url)) {
                    this.router.navigate(['']);
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
    }

    findMe(userId) {
        this.notificationService
            .findAllNotificationsByUser(userId.toString())
            .pipe(
                filter((res: HttpResponse<INotification[]>) => res.ok),
                map((res: HttpResponse<INotification[]>) => res.body)
            )
            .subscribe((res: INotification[]) => {
                this.userNotifications = res;
                localStorage.setItem('notifications', JSON.stringify(this.userNotifications));
            });
    }

    register() {
        this.activeModal.dismiss('to state register');
        this.router.navigate(['/register']);
    }

    requestResetPassword() {
        this.activeModal.dismiss('to state requestReset');
        this.router.navigate(['/reset', 'request']);
    }
}
