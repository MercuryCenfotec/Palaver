import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IUserApp } from 'app/shared/model/user-app.model';
import { UserAppService } from './user-app.service';

@Component({
    selector: 'jhi-user-app-delete-dialog',
    templateUrl: './user-app-delete-dialog.component.html'
})
export class UserAppDeleteDialogComponent {
    userApp: IUserApp;

    constructor(protected userAppService: UserAppService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.userAppService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'userAppListModification',
                content: 'Deleted an userApp'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-user-app-delete-popup',
    template: ''
})
export class UserAppDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ userApp }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(UserAppDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.userApp = userApp;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/user-app', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/user-app', { outlets: { popup: null } }]);
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
