import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { TestQuestionService } from 'app/entities/test-question';

@Component({
    selector: 'jhi-aptitude-test-detail',
    templateUrl: './aptitude-test-detail.component.html'
})
export class AptitudeTestDetailComponent implements OnInit {
    aptitudeTest: IAptitudeTest;

    constructor(protected activatedRoute: ActivatedRoute, protected questionsService: TestQuestionService) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ aptitudeTest }) => {
            this.aptitudeTest = aptitudeTest;
            this.questionsService.findAllByAptituteTest(this.aptitudeTest.id).subscribe(data => {
                this.aptitudeTest.questions = data.body;
                console.log(this.aptitudeTest);
            });
        });
    }

    previousState() {
        window.history.back();
    }
}
