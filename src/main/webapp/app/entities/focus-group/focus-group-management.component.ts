import { Component, ElementRef, OnInit, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { StateStorageService } from 'app/core';
import { FocusGroupService } from 'app/entities/focus-group/focus-group.service';

@Component({
    selector: 'jhi-focus-group-management',
    templateUrl: './focus-group-management.component.html'
})
export class FocusGroupManagementComponent implements OnInit {
    authenticationError: boolean;
    code: string;
    credentials: any;

    ngOnInit() {}

    constructor(
        private eventManager: JhiEventManager,
        private focusGroupService: FocusGroupService,
        private stateStorageService: StateStorageService,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private router: Router
    ) {
        this.credentials = {};
    }

    login() {
        this.focusGroupService;
        // .codeAuthenticate({
        code: this.code;
        // })
        // .then(() => {
        //     this.authenticationError = false;
        //     this.activeModal.dismiss('login success');
        //     if (this.router.url === '/register' || /^\/activate\//.test(this.router.url) || /^\/reset\//.test(this.router.url)) {
        //         this.router.navigate(['']);
        //     }
        //
        //     this.eventManager.broadcast({
        //         name: 'authenticationSuccess',
        //         content: 'Sending Authentication Success'
        //     });
        //
        //     // previousState was set in the authExpiredInterceptor before being redirected to login modal.
        //     // since login is successful, go to stored previousState and clear previousState
        //     const redirect = this.stateStorageService.getUrl();
        //     if (redirect) {
        //         this.stateStorageService.storeUrl(null);
        //         this.router.navigate([redirect]);
        //     }
        // })
        // .catch(() => {
        //     this.authenticationError = true;
        // });
    }

    /*
        register() {
            // this.activeModal.dismiss('to state register');
            this.router.navigate(['/register']);
        }

        requestResetPassword() {
            // this.activeModal.dismiss('to state requestReset');
            this.router.navigate(['/reset', 'request']);
        }*/
}
