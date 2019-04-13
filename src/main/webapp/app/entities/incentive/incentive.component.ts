import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IIncentive } from 'app/shared/model/incentive.model';
import { AccountService } from 'app/core';
import { IncentiveService } from './incentive.service';

@Component({
    selector: 'jhi-incentive',
    templateUrl: './incentive.component.html'
})
export class IncentiveComponent implements OnInit, OnDestroy {
    incentives: IIncentive[];
    currentAccount: any;
    eventSubscriber: Subscription;
    searchText;

    constructor(
        protected incentiveService: IncentiveService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.incentiveService
            .query()
            .pipe(
                filter((res: HttpResponse<IIncentive[]>) => res.ok),
                map((res: HttpResponse<IIncentive[]>) => res.body)
            )
            .subscribe(
                (res: IIncentive[]) => {
                    this.incentives = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInIncentives();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IIncentive) {
        return item.id;
    }

    registerChangeInIncentives() {
        this.eventSubscriber = this.eventManager.subscribe('incentiveListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
