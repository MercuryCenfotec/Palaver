import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IIncentive } from 'app/shared/model/incentive.model';
import { IncentiveService } from './incentive.service';
import { FocusGroupService } from 'app/entities/focus-group';

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
                content: 'El incentivo ' + this.incentive.name + ' ha sido eliminado.'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-incentive-warning-dialog',
    templateUrl: './incentive-warning-dialog.component.html'
})
export class IncentiveWarningDialogComponent {
    incentive: IIncentive;

    constructor(public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }
}

@Component({
    selector: 'jhi-incentive-delete-popup',
    template: ''
})
export class IncentiveDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected router: Router,
        protected modalService: NgbModal,
        protected focusGroupService: FocusGroupService
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ incentive }) => {
            setTimeout(() => {
                this.focusGroupService.findAllByIncentiveBetwenNow(incentive.id).subscribe(groups => {
                    if (groups.body.length > 0) {
                        this.ngbModalRef = this.modalService.open(IncentiveWarningDialogComponent as Component, {
                            size: 'lg',
                            backdrop: 'static'
                        });
                    } else {
                        this.ngbModalRef = this.modalService.open(IncentiveDeleteDialogComponent as Component, {
                            size: 'lg',
                            backdrop: 'static'
                        });
                    }
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
                });
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
