import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { FocusGroupService } from './focus-group.service';
import { Subscriber } from 'app/shared/util/subscriber';

@Component({
    selector: 'jhi-focus-group-delete-dialog',
    templateUrl: './focus-group-clone-test.component.html'
})
export class FocusGroupCloneTestComponent {
    focusGroup: IFocusGroup;

    constructor(
        protected focusGroupService: FocusGroupService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager,
        protected router: Router,
        protected subscriber: Subscriber<boolean>
    ) {}

    clear() {
        this.subscriber.next(false);
        this.activeModal.dismiss('cancel');
    }

    confirmCloning() {
        this.subscriber.next(true);
        this.activeModal.dismiss();
    }
}

@Component({
    selector: 'jhi-focus-group-delete-popup',
    template: ''
})
export class FocusGroupCloneTestPopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ focusGroup }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(FocusGroupCloneTestComponent as Component, {
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
