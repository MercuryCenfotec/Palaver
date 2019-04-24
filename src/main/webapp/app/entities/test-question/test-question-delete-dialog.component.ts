import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITestQuestion } from 'app/shared/model/test-question.model';
import { TestQuestionService } from './test-question.service';

@Component({
    selector: 'jhi-test-question-delete-dialog',
    templateUrl: './test-question-delete-dialog.component.html'
})
export class TestQuestionDeleteDialogComponent {
    testQuestion: ITestQuestion;

    constructor(
        protected testQuestionService: TestQuestionService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager,
        protected router: Router
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(question: ITestQuestion) {
        console.log(question);
        this.testQuestionService.delete(question.id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'testQuestionListModification',
                content: 'Deleted an testQuestion'
            });
            this.activeModal.dismiss(true);
            console.log(question.aptitudeTest.id);
            this.router.navigate(['/aptitude-test', question.aptitudeTest.id, 'edit']);
        });
    }
}

@Component({
    selector: 'jhi-test-question-delete-popup',
    template: ''
})
export class TestQuestionDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ testQuestion }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(TestQuestionDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.testQuestion = testQuestion;
                console.log(testQuestion);
                this.ngbModalRef.result.then(
                    result => {
                        // this.router.navigate(['/test-question', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        // this.router.navigate(['/test-question', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
