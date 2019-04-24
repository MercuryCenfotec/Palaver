import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { TestQuestionService } from 'app/entities/test-question';
import { FocusGroupService } from 'app/entities/focus-group';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { AptitudeTestService } from 'app/entities/aptitude-test/aptitude-test.service';

@Component({
    selector: 'jhi-aptitude-test-detail',
    templateUrl: './aptitude-test-detail.component.html'
})
export class AptitudeTestDetailComponent implements OnInit {
    aptitudeTest: IAptitudeTest;
    associatedGroup: IFocusGroup;
    groupInProcess: boolean;
    testInUse: boolean;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected questionsService: TestQuestionService,
        protected focusGroupService: FocusGroupService,
        protected aptitudeTestService: AptitudeTestService,
        protected router: Router
    ) {}

    ngOnInit() {
        this.groupInProcess = false;
        this.testInUse = false;
        this.activatedRoute.data.subscribe(({ aptitudeTest: test }) => {
            this.aptitudeTest = test;
            this.aptitudeTestService.isInUse(test.id).subscribe(isInUse => {
                this.testInUse = true;
                this.focusGroupService.findByAptitudeTest(test.id).subscribe(group => {
                    this.associatedGroup = group.body;
                    if (group.body.id) {
                        this.focusGroupService.isInProcess(group.body.id).subscribe(isInProcess => {
                            this.groupInProcess = isInProcess.body;
                        });
                    } else {
                        this.groupInProcess = false;
                    }
                });
            });
            this.questionsService.findAllByAptituteTest(this.aptitudeTest.id).subscribe(questions => {
                this.aptitudeTest.questions = questions.body;
                console.log(this.aptitudeTest);
            });
        });
    }

    testIsEditable(): boolean {
        if (this.testInUse) {
            return !this.groupInProcess;
        } else {
            return true;
        }
    }

    previousState() {
        this.router.navigate(['/aptitude-test']);
    }
}
