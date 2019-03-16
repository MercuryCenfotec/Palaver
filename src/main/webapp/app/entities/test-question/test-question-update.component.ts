import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ITestQuestion } from 'app/shared/model/test-question.model';
import { TestQuestionService } from './test-question.service';
import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { AptitudeTestService } from 'app/entities/aptitude-test';
import { TestAnswerOptionService } from 'app/entities/test-answer-option';

@Component({
    selector: 'jhi-test-question-update',
    templateUrl: './test-question-update.component.html'
})
export class TestQuestionUpdateComponent implements OnInit {
    testQuestion: ITestQuestion;
    isSaving: boolean;

    aptitudetests: IAptitudeTest[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected testQuestionService: TestQuestionService,
        protected aptitudeTestService: AptitudeTestService,
        protected activatedRoute: ActivatedRoute,
        protected testAnswerService: TestAnswerOptionService
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ testQuestion }) => {
            this.testQuestion = testQuestion;
            this.testAnswerService.findAllByTestQuestion(testQuestion.id).subscribe(data => {
                this.testQuestion.answers = data.body;
            });
        });
        this.aptitudeTestService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IAptitudeTest[]>) => mayBeOk.ok),
                map((response: HttpResponse<IAptitudeTest[]>) => response.body)
            )
            .subscribe((res: IAptitudeTest[]) => (this.aptitudetests = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.subscribeToSaveResponse(this.testQuestionService.update(this.testQuestion));
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ITestQuestion>>) {
        result.subscribe((res: HttpResponse<ITestQuestion>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackAptitudeTestById(index: number, item: IAptitudeTest) {
        return item.id;
    }
}
