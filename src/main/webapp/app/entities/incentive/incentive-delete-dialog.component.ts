import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IIncentive } from 'app/shared/model/incentive.model';
import { IncentiveService } from './incentive.service';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import * as moment from 'moment';

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

    validateUse() {
        this.incentiveService.find(this.incentive.id).subscribe(incentive => {
            this.incentive = incentive.body;
            if (this.incentive.focusGroups == null) {
                return false;
            } else {
                this.incentive.focusGroups.forEach((focusGroup: IFocusGroup) => {
                    if (
                        focusGroup.beginDate.toDate().getDate() >
                            moment()
                                .toDate()
                                .getDate() ||
                        focusGroup.endDate.toDate().getDate() >
                            moment()
                                .toDate()
                                .getDate()
                    ) {
                        return true;
                    }
                });
                return false;
            }
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
                this.ngbModalRef = this.modalService.open(IncentiveDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
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
