import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITestAnswerOption } from 'app/shared/model/test-answer-option.model';

@Component({
    selector: 'jhi-test-answer-option-detail',
    templateUrl: './test-answer-option-detail.component.html'
})
export class TestAnswerOptionDetailComponent implements OnInit {
    testAnswerOption: ITestAnswerOption;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ testAnswerOption }) => {
            this.testAnswerOption = testAnswerOption;
        });
    }

    previousState() {
        window.history.back();
    }
}
