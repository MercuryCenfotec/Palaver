import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ISystemVariable } from 'app/shared/model/system-variable.model';
import { AccountService } from 'app/core';
import { SystemVariableService } from './system-variable.service';

@Component({
    selector: 'jhi-system-variable',
    templateUrl: './system-variable.component.html'
})
export class SystemVariableComponent implements OnInit, OnDestroy {
    systemVariables: ISystemVariable[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected systemVariableService: SystemVariableService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.systemVariableService
            .query()
            .pipe(
                filter((res: HttpResponse<ISystemVariable[]>) => res.ok),
                map((res: HttpResponse<ISystemVariable[]>) => res.body)
            )
            .subscribe(
                (res: ISystemVariable[]) => {
                    this.systemVariables = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInSystemVariables();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ISystemVariable) {
        return item.id;
    }

    registerChangeInSystemVariables() {
        this.eventSubscriber = this.eventManager.subscribe('systemVariableListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
