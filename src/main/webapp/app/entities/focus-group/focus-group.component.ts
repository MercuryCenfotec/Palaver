import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { AccountService } from 'app/core';
import { FocusGroupService } from './focus-group.service';

@Component({
    selector: 'jhi-focus-group',
    templateUrl: './focus-group.component.html'
})
export class FocusGroupComponent implements OnInit, OnDestroy {
    focusGroups: IFocusGroup[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected focusGroupService: FocusGroupService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.focusGroupService
            .query()
            .pipe(
                filter((res: HttpResponse<IFocusGroup[]>) => res.ok),
                map((res: HttpResponse<IFocusGroup[]>) => res.body)
            )
            .subscribe(
                (res: IFocusGroup[]) => {
                    this.focusGroups = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInFocusGroups();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IFocusGroup) {
        return item.id;
    }

    registerChangeInFocusGroups() {
        this.eventSubscriber = this.eventManager.subscribe('focusGroupListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
