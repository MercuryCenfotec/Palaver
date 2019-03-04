import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';

@Component({
    selector: 'jhi-aptitude-test-detail',
    templateUrl: './aptitude-test-detail.component.html'
})
export class AptitudeTestDetailComponent implements OnInit {
    aptitudeTest: IAptitudeTest;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ aptitudeTest }) => {
            this.aptitudeTest = aptitudeTest;
        });
    }

    previousState() {
        window.history.back();
    }
}
