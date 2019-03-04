import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IBalanceAccount } from 'app/shared/model/balance-account.model';
import { AccountService } from 'app/core';
import { BalanceAccountService } from './balance-account.service';

@Component({
    selector: 'jhi-balance-account',
    templateUrl: './balance-account.component.html'
})
export class BalanceAccountComponent implements OnInit, OnDestroy {
    balanceAccounts: IBalanceAccount[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected balanceAccountService: BalanceAccountService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.balanceAccountService
            .query()
            .pipe(
                filter((res: HttpResponse<IBalanceAccount[]>) => res.ok),
                map((res: HttpResponse<IBalanceAccount[]>) => res.body)
            )
            .subscribe(
                (res: IBalanceAccount[]) => {
                    this.balanceAccounts = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInBalanceAccounts();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IBalanceAccount) {
        return item.id;
    }

    registerChangeInBalanceAccounts() {
        this.eventSubscriber = this.eventManager.subscribe('balanceAccountListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
