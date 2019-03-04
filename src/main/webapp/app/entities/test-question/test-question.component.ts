import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITestQuestion } from 'app/shared/model/test-question.model';
import { AccountService } from 'app/core';
import { TestQuestionService } from './test-question.service';

@Component({
    selector: 'jhi-test-question',
    templateUrl: './test-question.component.html'
})
export class TestQuestionComponent implements OnInit, OnDestroy {
    testQuestions: ITestQuestion[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected testQuestionService: TestQuestionService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.testQuestionService
            .query()
            .pipe(
                filter((res: HttpResponse<ITestQuestion[]>) => res.ok),
                map((res: HttpResponse<ITestQuestion[]>) => res.body)
            )
            .subscribe(
                (res: ITestQuestion[]) => {
                    this.testQuestions = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInTestQuestions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITestQuestion) {
        return item.id;
    }

    registerChangeInTestQuestions() {
        this.eventSubscriber = this.eventManager.subscribe('testQuestionListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
