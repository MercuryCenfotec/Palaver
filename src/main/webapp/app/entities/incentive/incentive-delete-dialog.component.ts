import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IIncentive } from 'app/shared/model/incentive.model';
import { IncentiveService } from './incentive.service';

@Component({
    selector: 'jhi-incentive-delete-dialog',
    templateUrl: './incentive-delete-dialog.component.html'
})
export class IncentiveDeleteDialogComponent {
    incentive: IIncentive;

    constructor(
        protected incentiveService: IncentiveService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.incentiveService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'incentiveListModification',
                content: 'Deleted an incentive'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-incentive-delete-popup',
    template: ''
})
export class IncentiveDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ incentive }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(IncentiveDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.incentive = incentive;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/incentive', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/incentive', { outlets: { popup: null } }]);
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
