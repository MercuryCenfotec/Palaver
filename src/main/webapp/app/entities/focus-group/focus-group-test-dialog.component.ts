import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { FocusGroupService } from './focus-group.service';
import { AptitudeTestService } from 'app/entities/aptitude-test';

@Component({
    selector: 'jhi-focus-group-test-dialog',
    templateUrl: './focus-group-test-dialog.component.html'
})
export class FocusGroupTestDialogComponent {
    focusGroup: IFocusGroup;

    constructor(
        protected focusGroupService: FocusGroupService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager,
        protected router: Router,
        protected aptitudeTestService: AptitudeTestService
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.focusGroupService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'focusGroupListModification',
                content: 'Deleted an focusGroup'
            });
            this.activeModal.dismiss(true);
            window.history.go(-2);
        });
    }
}

@Component({
    selector: 'jhi-focus-group-delete-popup',
    template: ''
})
export class FocusGroupTestDialogPopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ focusGroup }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(FocusGroupTestDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.focusGroup = focusGroup;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/focus-group', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/focus-group', { outlets: { popup: null } }]);
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
