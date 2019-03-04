import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITestResult } from 'app/shared/model/test-result.model';

@Component({
    selector: 'jhi-test-result-detail',
    templateUrl: './test-result-detail.component.html'
})
export class TestResultDetailComponent implements OnInit {
    testResult: ITestResult;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ testResult }) => {
            this.testResult = testResult;
        });
    }

    previousState() {
        window.history.back();
    }
}
