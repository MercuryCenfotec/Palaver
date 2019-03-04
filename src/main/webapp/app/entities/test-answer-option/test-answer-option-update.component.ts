import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ITestAnswerOption } from 'app/shared/model/test-answer-option.model';
import { TestAnswerOptionService } from './test-answer-option.service';
import { ITestQuestion } from 'app/shared/model/test-question.model';
import { TestQuestionService } from 'app/entities/test-question';

@Component({
    selector: 'jhi-test-answer-option-update',
    templateUrl: './test-answer-option-update.component.html'
})
export class TestAnswerOptionUpdateComponent implements OnInit {
    testAnswerOption: ITestAnswerOption;
    isSaving: boolean;

    testquestions: ITestQuestion[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected testAnswerOptionService: TestAnswerOptionService,
        protected testQuestionService: TestQuestionService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ testAnswerOption }) => {
            this.testAnswerOption = testAnswerOption;
        });
        this.testQuestionService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ITestQuestion[]>) => mayBeOk.ok),
                map((response: HttpResponse<ITestQuestion[]>) => response.body)
            )
            .subscribe((res: ITestQuestion[]) => (this.testquestions = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.testAnswerOption.id !== undefined) {
            this.subscribeToSaveResponse(this.testAnswerOptionService.update(this.testAnswerOption));
        } else {
            this.subscribeToSaveResponse(this.testAnswerOptionService.create(this.testAnswerOption));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ITestAnswerOption>>) {
        result.subscribe((res: HttpResponse<ITestAnswerOption>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackTestQuestionById(index: number, item: ITestQuestion) {
        return item.id;
    }
}
