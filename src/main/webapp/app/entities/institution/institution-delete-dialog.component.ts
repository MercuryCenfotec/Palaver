import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IInstitution } from 'app/shared/model/institution.model';
import { InstitutionService } from './institution.service';

@Component({
    selector: 'jhi-institution-delete-dialog',
    templateUrl: './institution-delete-dialog.component.html'
})
export class InstitutionDeleteDialogComponent {
    institution: IInstitution;

    constructor(
        protected institutionService: InstitutionService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.institutionService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'institutionListModification',
                content: 'Deleted an institution'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-institution-delete-popup',
    template: ''
})
export class InstitutionDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ institution }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(InstitutionDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.institution = institution;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/institution', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/institution', { outlets: { popup: null } }]);
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
