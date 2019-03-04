import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITestQuestion } from 'app/shared/model/test-question.model';

@Component({
    selector: 'jhi-test-question-detail',
    templateUrl: './test-question-detail.component.html'
})
export class TestQuestionDetailComponent implements OnInit {
    testQuestion: ITestQuestion;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ testQuestion }) => {
            this.testQuestion = testQuestion;
        });
    }

    previousState() {
        window.history.back();
    }
}
