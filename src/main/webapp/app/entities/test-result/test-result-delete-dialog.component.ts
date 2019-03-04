import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITestResult } from 'app/shared/model/test-result.model';
import { TestResultService } from './test-result.service';

@Component({
    selector: 'jhi-test-result-delete-dialog',
    templateUrl: './test-result-delete-dialog.component.html'
})
export class TestResultDeleteDialogComponent {
    testResult: ITestResult;

    constructor(
        protected testResultService: TestResultService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.testResultService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'testResultListModification',
                content: 'Deleted an testResult'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-test-result-delete-popup',
    template: ''
})
export class TestResultDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ testResult }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(TestResultDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.testResult = testResult;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/test-result', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/test-result', { outlets: { popup: null } }]);
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
