import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { AptitudeTestService } from './aptitude-test.service';
import { IInstitution } from 'app/shared/model/institution.model';
import { InstitutionService } from 'app/entities/institution';
import { UserService } from 'app/core';
import { ITestQuestion } from 'app/shared/model/test-question.model';
import { ITestAnswerOption } from 'app/shared/model/test-answer-option.model';

@Component({
    selector: 'jhi-aptitude-test-form',
    templateUrl: './aptitude-test-form.component.html'
})
export class AptitudeTestFormComponent implements OnInit {
    aptitudeTest: IAptitudeTest;
    isSaving: boolean;
    newQuestion: ITestQuestion;
    newAnswer: ITestAnswerOption;
    institutions: IInstitution[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected aptitudeTestService: AptitudeTestService,
        protected institutionService: InstitutionService,
        protected userService: UserService
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.aptitudeTest = new class implements IAptitudeTest {
            createdDate: string;
            id: number;
            institution: IInstitution;
            name: string;
            questions: ITestQuestion[] = [];
        }();
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
        this.userService.getUserWithAuthorities().subscribe(data => {
            this.institutionService.getByUserUser(data.id).subscribe(innerData => {
                this.aptitudeTest.institution = innerData.body;
                this.aptitudeTest.createdDate = new Date().toJSON();
                this.subscribeToSaveResponse(this.aptitudeTestService.create(this.aptitudeTest));
            });
        });
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IAptitudeTest>>) {
        result.subscribe((res: HttpResponse<IAptitudeTest>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError(res));
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError(err: HttpErrorResponse) {
        this.isSaving = false;
        console.log(err);
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
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
        this.newAnswer.answer = '';
        this.newQuestion.answers = [];
        console.log(this.aptitudeTest);
    }

    removeQuestionFromTest(deletedQuestion: ITestQuestion) {
        this.aptitudeTest.questions.splice(this.aptitudeTest.questions.indexOf(deletedQuestion), 1);
    }

    removeAnswerFromPreview(deletedAnswer: ITestAnswerOption) {
        this.newQuestion.answers.splice(this.newQuestion.answers.indexOf(deletedAnswer), 1);
    }

    validateQuestions(): boolean {
        return this.aptitudeTest.questions.length !== 0;
    }

    repeatedQuestion(): boolean {
        for (const question of this.aptitudeTest.questions) {
            if (question.question === this.newQuestion.question) {
                return true;
            }
        }
        return false;
    }

    repeatedAnswer() {
        for (const answer of this.newQuestion.answers) {
            if (answer.answer === this.newAnswer.answer) {
                return true;
            }
        }
        return false;
    }
}
