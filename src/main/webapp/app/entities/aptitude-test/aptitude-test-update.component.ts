import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
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
        protected questionsService: TestQuestionService,
        protected router: Router
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ aptitudeTest }) => {
            this.aptitudeTest = aptitudeTest;
            this.questionsService.findAllByAptituteTest(this.aptitudeTest.id).subscribe(data => {
                this.aptitudeTest.questions = data.body;
                console.log(data.body);
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
    }

    previousState() {
        this.router.navigate(['/aptitude-test', this.aptitudeTest.id, 'view']);
    }

    save() {
        this.isSaving = true;
        this.subscribeToSaveResponse(this.aptitudeTestService.update(this.aptitudeTest));
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
        this.newQuestion.answers = [];
    }

    removeQuestionFromTest(deletedQuestion: ITestQuestion) {
        this.aptitudeTest.questions.splice(this.aptitudeTest.questions.indexOf(deletedQuestion), 1);
    }

    removeAnswerFromPreview(deletedAnswer: ITestAnswerOption) {
        this.newQuestion.answers.splice(this.newQuestion.answers.indexOf(deletedAnswer), 1);
    }

    validateQuestions(): boolean {
        return this.aptitudeTest.questions.length > 0;
    }

    repeatedQuestion(): boolean {
        const mockQuestion = new class implements ITestQuestion {
            answers: ITestAnswerOption[];
            aptitudeTest: IAptitudeTest;
            id: number;
            question: string;
        }();
        mockQuestion.question = this.newQuestion.question;
        for (const question of this.aptitudeTest.questions) {
            if (question.question === mockQuestion.question) {
                return true;
            }
        }
        return false;
    }

    repeatedAnswer(): boolean {
        const mockAnswer = new class implements ITestAnswerOption {
            answer: string;
            desired: boolean;
            id: number;
            testQuestion: ITestQuestion;
        }();
        mockAnswer.answer = this.newAnswer.answer;
        for (const answer of this.newQuestion.answers) {
            if (answer.answer === mockAnswer.answer) {
                return true;
            }
        }
        return false;
    }

    removeQuestion(question: ITestQuestion) {
        question.question = 'delete';
    }

    validQuestionsLength(): boolean {
        let amount = 0;
        for (const question of this.aptitudeTest.questions) {
            if (question.question !== 'delete') {
                amount++;
            }
        }
        return amount > 1;
    }
}
