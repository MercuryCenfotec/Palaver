import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { AccountService, UserService } from 'app/core';
import { AptitudeTestService } from './aptitude-test.service';
import { InstitutionService } from 'app/entities/institution';

@Component({
    selector: 'jhi-aptitude-test',
    templateUrl: './aptitude-test.component.html'
})
export class AptitudeTestComponent implements OnInit, OnDestroy {
    aptitudeTests: IAptitudeTest[];
    currentAccount: any;
    eventSubscriber: Subscription;
    searchText;

    constructor(
        protected aptitudeTestService: AptitudeTestService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected userService: UserService,
        protected institutionService: InstitutionService
    ) {}

    loadByInstitution() {
        this.loadAll();
    }

    loadAll() {
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.institutionService.getByUserUser(user.id).subscribe(institution => {
                this.aptitudeTestService.findAllByInstitution(institution.body.id).subscribe(aptitudeTests => {
                    this.aptitudeTests = aptitudeTests.body;
                });
            });
        });
    }

    ngOnInit() {
        this.loadByInstitution();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInAptitudeTests();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IAptitudeTest) {
        return item.id;
    }

    registerChangeInAptitudeTests() {
        this.eventSubscriber = this.eventManager.subscribe('aptitudeTestListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
