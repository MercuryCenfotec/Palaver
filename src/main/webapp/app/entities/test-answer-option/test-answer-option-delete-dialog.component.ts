import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITestAnswerOption } from 'app/shared/model/test-answer-option.model';
import { TestAnswerOptionService } from './test-answer-option.service';

@Component({
    selector: 'jhi-test-answer-option-delete-dialog',
    templateUrl: './test-answer-option-delete-dialog.component.html'
})
export class TestAnswerOptionDeleteDialogComponent {
    testAnswerOption: ITestAnswerOption;

    constructor(
        protected testAnswerOptionService: TestAnswerOptionService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.testAnswerOptionService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'testAnswerOptionListModification',
                content: 'Deleted an testAnswerOption'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-test-answer-option-delete-popup',
    template: ''
})
export class TestAnswerOptionDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ testAnswerOption }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(TestAnswerOptionDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.testAnswerOption = testAnswerOption;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/test-answer-option', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/test-answer-option', { outlets: { popup: null } }]);
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
