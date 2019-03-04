import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISystemVariable } from 'app/shared/model/system-variable.model';
import { SystemVariableService } from './system-variable.service';

@Component({
    selector: 'jhi-system-variable-delete-dialog',
    templateUrl: './system-variable-delete-dialog.component.html'
})
export class SystemVariableDeleteDialogComponent {
    systemVariable: ISystemVariable;

    constructor(
        protected systemVariableService: SystemVariableService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.systemVariableService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'systemVariableListModification',
                content: 'Deleted an systemVariable'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-system-variable-delete-popup',
    template: ''
})
export class SystemVariableDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ systemVariable }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(SystemVariableDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.systemVariable = systemVariable;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/system-variable', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/system-variable', { outlets: { popup: null } }]);
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
