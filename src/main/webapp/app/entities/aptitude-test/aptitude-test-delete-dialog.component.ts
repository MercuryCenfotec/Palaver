import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { AptitudeTestService } from './aptitude-test.service';

@Component({
    selector: 'jhi-aptitude-test-delete-dialog',
    templateUrl: './aptitude-test-delete-dialog.component.html'
})
export class AptitudeTestDeleteDialogComponent {
    aptitudeTest: IAptitudeTest;

    constructor(
        protected aptitudeTestService: AptitudeTestService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.aptitudeTestService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'aptitudeTestListModification',
                content: 'Deleted an aptitudeTest'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-aptitude-test-delete-popup',
    template: ''
})
export class AptitudeTestDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ aptitudeTest }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(AptitudeTestDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.aptitudeTest = aptitudeTest;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/aptitude-test', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/aptitude-test', { outlets: { popup: null } }]);
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
