import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ITestQuestion } from 'app/shared/model/test-question.model';
import { TestQuestionService } from './test-question.service';
import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { AptitudeTestService } from 'app/entities/aptitude-test';
import { TestAnswerOptionService } from 'app/entities/test-answer-option';
import { ITestAnswerOption } from 'app/shared/model/test-answer-option.model';

@Component({
    selector: 'jhi-test-question-update',
    templateUrl: './test-question-update.component.html'
})
export class TestQuestionUpdateComponent implements OnInit {
    testQuestion: ITestQuestion;
    isSaving: boolean;
    newAnswer: ITestAnswerOption;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected testQuestionService: TestQuestionService,
        protected activatedRoute: ActivatedRoute,
        protected testAnswerService: TestAnswerOptionService,
        protected router: Router
    ) {}

    ngOnInit() {
        this.newAnswer = new class implements ITestAnswerOption {
            answer: string;
            desired: boolean;
            id: number;
            testQuestion: ITestQuestion;
        }();
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ testQuestion }) => {
            this.testQuestion = testQuestion;
            this.testQuestionService.findAllByAptituteTest(testQuestion.aptitudeTest.id).subscribe(questions => {
                this.testQuestion.aptitudeTest.questions = questions.body;
                console.log(this.testQuestion.aptitudeTest.questions);
            });
            this.testAnswerService.findAllByTestQuestion(testQuestion.id).subscribe(aswers => {
                this.testQuestion.answers = aswers.body;
            });
        });
    }

    previousState() {
        this.router.navigate(['/aptitude-test', this.testQuestion.aptitudeTest.id, 'edit']);
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

    removeAnswer(answer: ITestAnswerOption) {
        answer.answer = 'delete';
    }

    validAnswersLength(): boolean {
        let amount = 0;
        for (const answer of this.testQuestion.answers) {
            if (answer.answer !== 'delete') {
                amount++;
            }
        }
        return amount > 2;
    }

    addAnswerToQuestion() {
        const answer: ITestAnswerOption = new class implements ITestAnswerOption {
            answer: string;
            desired: boolean;
            id: number;
            testQuestion: ITestQuestion;
        }();
        answer.answer = this.newAnswer.answer;
        answer.desired = false;
        this.testQuestion.answers.push(answer);
        this.newAnswer.answer = '';
        console.log(this.testQuestion);
    }

    repeatedNewAnswer(): boolean {
        for (const answer of this.testQuestion.answers) {
            if (answer.answer === this.newAnswer.answer) {
                return true;
            }
        }
        return false;
    }

    repeatedEditedAnswer(givenAnswer: ITestAnswerOption): boolean {
        for (const answer of this.testQuestion.answers) {
            if (answer !== givenAnswer) {
                if (answer.answer === givenAnswer.answer) {
                    return true;
                }
            }
        }
        return false;
    }

    repeatedQuestion(): boolean {
        const mockQuestion = new class implements ITestQuestion {
            answers: ITestAnswerOption[];
            aptitudeTest: IAptitudeTest;
            id: number;
            question: string;
        }();
        mockQuestion.question = this.testQuestion.question;
        mockQuestion.id = this.testQuestion.id;
        for (const question of this.testQuestion.aptitudeTest.questions) {
            if (question.question === mockQuestion.question && question.id !== mockQuestion.id) {
                return true;
            }
        }
        return false;
    }

    repeatedAnswers(): boolean {
        for (const answer of this.testQuestion.answers) {
            if (this.repeatedEditedAnswer(answer)) {
                return true;
            }
        }
        return false;
    }
}
