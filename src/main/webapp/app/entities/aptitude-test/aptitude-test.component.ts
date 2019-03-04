import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { AccountService } from 'app/core';
import { AptitudeTestService } from './aptitude-test.service';

@Component({
    selector: 'jhi-aptitude-test',
    templateUrl: './aptitude-test.component.html'
})
export class AptitudeTestComponent implements OnInit, OnDestroy {
    aptitudeTests: IAptitudeTest[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected aptitudeTestService: AptitudeTestService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.aptitudeTestService
            .query()
            .pipe(
                filter((res: HttpResponse<IAptitudeTest[]>) => res.ok),
                map((res: HttpResponse<IAptitudeTest[]>) => res.body)
            )
            .subscribe(
                (res: IAptitudeTest[]) => {
                    this.aptitudeTests = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
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
