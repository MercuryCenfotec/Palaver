import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITestResult } from 'app/shared/model/test-result.model';
import { AccountService } from 'app/core';
import { TestResultService } from './test-result.service';
import { FocusGroupService } from 'app/entities/focus-group';
import { IParticipant } from 'app/shared/model/participant.model';
import moment = require('moment');

@Component({
    selector: 'jhi-test-result',
    templateUrl: './test-result.component.html'
})
export class TestResultComponent implements OnInit, OnDestroy {
    testResults: ITestResult[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected testResultService: TestResultService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected focusGroupService: FocusGroupService
    ) {}

    loadAll() {
        this.testResultService
            .query()
            .pipe(
                filter((res: HttpResponse<ITestResult[]>) => res.ok),
                map((res: HttpResponse<ITestResult[]>) => res.body)
            )
            .subscribe(
                (res: ITestResult[]) => {
                    this.testResults = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInTestResults();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITestResult) {
        return item.id;
    }

    registerChangeInTestResults() {
        this.eventSubscriber = this.eventManager.subscribe('testResultListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    acceptParticipant(event: ITestResult) {
        const participants: IParticipant[] = [];
        event.focusGroup.participants = participants;
        event.focusGroup.participants.push(event.participant);
        event.focusGroup.beginDate = moment(event.focusGroup.beginDate, 'YYYY-MM-DD');
        event.focusGroup.endDate = moment(event.focusGroup.endDate, 'YYYY-MM-DD');
        this.focusGroupService.update(event.focusGroup).subscribe(data => {
            this.testResultService.delete(event.id).subscribe(data2 => {
                this.loadAll();
            });
        });
    }

    rejectParticipant(event: ITestResult) {
        this.testResultService.delete(event.id).subscribe(data => {
            this.loadAll();
        });
    }
}
