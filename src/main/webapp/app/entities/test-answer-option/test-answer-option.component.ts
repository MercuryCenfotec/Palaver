import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITestAnswerOption } from 'app/shared/model/test-answer-option.model';
import { AccountService } from 'app/core';
import { TestAnswerOptionService } from './test-answer-option.service';

@Component({
    selector: 'jhi-test-answer-option',
    templateUrl: './test-answer-option.component.html'
})
export class TestAnswerOptionComponent implements OnInit, OnDestroy {
    testAnswerOptions: ITestAnswerOption[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected testAnswerOptionService: TestAnswerOptionService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.testAnswerOptionService
            .query()
            .pipe(
                filter((res: HttpResponse<ITestAnswerOption[]>) => res.ok),
                map((res: HttpResponse<ITestAnswerOption[]>) => res.body)
            )
            .subscribe(
                (res: ITestAnswerOption[]) => {
                    this.testAnswerOptions = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInTestAnswerOptions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITestAnswerOption) {
        return item.id;
    }

    registerChangeInTestAnswerOptions() {
        this.eventSubscriber = this.eventManager.subscribe('testAnswerOptionListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
