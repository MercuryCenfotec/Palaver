import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IIncentive } from 'app/shared/model/incentive.model';
import { AccountService, UserService } from 'app/core';
import { IncentiveService } from './incentive.service';
import { IInstitution } from 'app/shared/model/institution.model';
import { InstitutionService } from 'app/entities/institution';

@Component({
    selector: 'jhi-incentive',
    templateUrl: './incentive.component.html'
})
export class IncentiveComponent implements OnInit, OnDestroy {
    incentives: IIncentive[];
    currentAccount: any;
    eventSubscriber: Subscription;
    searchText;
    institution: IInstitution;

    constructor(
        protected incentiveService: IncentiveService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected userService: UserService,
        protected institutionService: InstitutionService
    ) {}

    loadAll() {}

    ngOnInit() {
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.institutionService.getByUserUser(user.id).subscribe(institution => {
                this.institution = institution.body;
                this.incentiveService.findAllByInstitution(institution.body.id).subscribe(
                    res => {
                        this.incentives = res.body;
                    },
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            });
        });
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
