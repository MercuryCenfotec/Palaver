import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { AptitudeTestService } from './aptitude-test.service';
import { IInstitution } from 'app/shared/model/institution.model';
import { InstitutionService } from 'app/entities/institution';
import { TestQuestionService } from 'app/entities/test-question';
import { ITestQuestion } from 'app/shared/model/test-question.model';
import { ITestAnswerOption } from 'app/shared/model/test-answer-option.model';

@Component({
    selector: 'jhi-aptitude-test-update',
    templateUrl: './aptitude-test-update.component.html'
})
export class AptitudeTestUpdateComponent implements OnInit {
    aptitudeTest: IAptitudeTest;
    isSaving: boolean;
    newQuestion: ITestQuestion;
    newAnswer: ITestAnswerOption;
    institutions: IInstitution[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected aptitudeTestService: AptitudeTestService,
        protected institutionService: InstitutionService,
        protected activatedRoute: ActivatedRoute,
        protected questionsService: TestQuestionService
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ aptitudeTest }) => {
            this.aptitudeTest = aptitudeTest;
            this.questionsService.findAllByAptituteTest(this.aptitudeTest.id).subscribe(data => {
                this.aptitudeTest.questions = data.body;
                console.log(this.aptitudeTest);
            });
        });
        this.newQuestion = new class implements ITestQuestion {
            answers: ITestAnswerOption[] = [];
            aptitudeTest: IAptitudeTest;
            id: number;
            question: string;
        }();
        this.newAnswer = new class implements ITestAnswerOption {
            answer: string;
            desired: boolean;
            id: number;
            testQuestion: ITestQuestion;
        }();
        this.institutionService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IInstitution[]>) => mayBeOk.ok),
                map((response: HttpResponse<IInstitution[]>) => response.body)
            )
            .subscribe((res: IInstitution[]) => (this.institutions = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.aptitudeTest.id !== undefined) {
            this.subscribeToSaveResponse(this.aptitudeTestService.update(this.aptitudeTest));
        } else {
            this.subscribeToSaveResponse(this.aptitudeTestService.create(this.aptitudeTest));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IAptitudeTest>>) {
        result.subscribe((res: HttpResponse<IAptitudeTest>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackInstitutionById(index: number, item: IInstitution) {
        return item.id;
    }

    addAnswerToQuestion() {
        const answer: ITestAnswerOption = new class implements ITestAnswerOption {
            answer: string;
            desired: boolean;
            id: number;
            testQuestion: ITestQuestion;
        }();
        answer.answer = this.newAnswer.answer;
        console.log(answer);
        answer.desired = false;
        this.newQuestion.answers.push(answer);
        this.newAnswer.answer = '';
    }

    addQuestionToTest() {
        const question: ITestQuestion = new class implements ITestQuestion {
            answers: ITestAnswerOption[] = [];
            aptitudeTest: IAptitudeTest;
            id: number;
            question: string;
        }();
        question.question = this.newQuestion.question;
        question.answers = this.newQuestion.answers;
        this.aptitudeTest.questions.push(question);
        this.newQuestion.question = '';
        this.newQuestion.answers = [];
        console.log(this.aptitudeTest);
    }
}
