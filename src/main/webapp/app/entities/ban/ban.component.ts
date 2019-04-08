import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IBan } from 'app/shared/model/ban.model';
import { AccountService } from 'app/core';
import { BanService } from './ban.service';

@Component({
    selector: 'jhi-ban',
    templateUrl: './ban.component.html'
})
export class BanComponent implements OnInit, OnDestroy {
    bans: IBan[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected banService: BanService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.banService
            .query()
            .pipe(
                filter((res: HttpResponse<IBan[]>) => res.ok),
                map((res: HttpResponse<IBan[]>) => res.body)
            )
            .subscribe(
                (res: IBan[]) => {
                    this.bans = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInBans();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IBan) {
        return item.id;
    }

    registerChangeInBans() {
        this.eventSubscriber = this.eventManager.subscribe('banListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
