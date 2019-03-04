import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IInstitution } from 'app/shared/model/institution.model';
import { AccountService } from 'app/core';
import { InstitutionService } from './institution.service';

@Component({
    selector: 'jhi-institution',
    templateUrl: './institution.component.html'
})
export class InstitutionComponent implements OnInit, OnDestroy {
    institutions: IInstitution[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected institutionService: InstitutionService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.institutionService
            .query()
            .pipe(
                filter((res: HttpResponse<IInstitution[]>) => res.ok),
                map((res: HttpResponse<IInstitution[]>) => res.body)
            )
            .subscribe(
                (res: IInstitution[]) => {
                    this.institutions = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInInstitutions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IInstitution) {
        return item.id;
    }

    registerChangeInInstitutions() {
        this.eventSubscriber = this.eventManager.subscribe('institutionListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
