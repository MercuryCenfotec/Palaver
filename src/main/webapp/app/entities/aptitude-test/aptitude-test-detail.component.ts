import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { TestQuestionService } from 'app/entities/test-question';
import { FocusGroupService } from 'app/entities/focus-group';
import { IFocusGroup } from 'app/shared/model/focus-group.model';

@Component({
    selector: 'jhi-aptitude-test-detail',
    templateUrl: './aptitude-test-detail.component.html'
})
export class AptitudeTestDetailComponent implements OnInit {
    aptitudeTest: IAptitudeTest;
    associatedGroup: IFocusGroup;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected questionsService: TestQuestionService,
        protected focusGroupService: FocusGroupService,
        protected router: Router
    ) {}

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
        this.router.navigate(['/aptitude-test']);
    }
}
