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
    groupInProcess: boolean;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected questionsService: TestQuestionService,
        protected focusGroupService: FocusGroupService,
        protected router: Router
    ) {}

    ngOnInit() {
        this.groupInProcess = false;
        this.activatedRoute.data.subscribe(({ aptitudeTest }) => {
            this.aptitudeTest = aptitudeTest;
            this.focusGroupService.findByAptitudeTest(aptitudeTest.id).subscribe(group => {
                this.associatedGroup = group.body;
                this.isInProcess();
            });
            this.questionsService.findAllByAptituteTest(this.aptitudeTest.id).subscribe(data => {
                this.aptitudeTest.questions = data.body;
                console.log(this.aptitudeTest);
            });
        });
    }

    previousState() {
        this.router.navigate(['/aptitude-test']);
    }

    isInProcess() {
        this.focusGroupService.isInProcess(this.associatedGroup.id).subscribe(data => {
            this.groupInProcess = data.body;
        });
    }
}
