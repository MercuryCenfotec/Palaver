import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginModalService, AccountService, Account } from 'app/core';
import { ZoomApiService } from 'app/shared/util/zoom-api.service';
import { ZoomMeeting } from 'app/shared/model/zoom-meeting.model';

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
        private zoomApiService: ZoomApiService
    ) {}

    ngOnInit() {
        this.accountService.identity().then((account: Account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
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

    test() {
        let date = new Date();
        const meeting = new ZoomMeeting(
            null,
            'prueba01',
            null,
            date,
            null,
            null,
            'cododoimf',
            'meeting de prueba',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        );
        console.log(this.zoomApiService.create(meeting));
    }
}
