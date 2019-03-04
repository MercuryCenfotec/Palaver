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
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.testQuestionService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'testQuestionListModification',
                content: 'Deleted an testQuestion'
            });
            this.activeModal.dismiss(true);
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
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/test-question', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/test-question', { outlets: { popup: null } }]);
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
