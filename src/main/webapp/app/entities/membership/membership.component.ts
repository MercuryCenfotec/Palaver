import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IMembership } from 'app/shared/model/membership.model';
import { AccountService } from 'app/core';
import { MembershipService } from './membership.service';

@Component({
    selector: 'jhi-membership',
    templateUrl: './membership.component.html'
})
export class MembershipComponent implements OnInit, OnDestroy {
    memberships: IMembership[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected membershipService: MembershipService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.membershipService
            .query()
            .pipe(
                filter((res: HttpResponse<IMembership[]>) => res.ok),
                map((res: HttpResponse<IMembership[]>) => res.body)
            )
            .subscribe(
                (res: IMembership[]) => {
                    this.memberships = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInMemberships();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IMembership) {
        return item.id;
    }

    registerChangeInMemberships() {
        this.eventSubscriber = this.eventManager.subscribe('membershipListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
