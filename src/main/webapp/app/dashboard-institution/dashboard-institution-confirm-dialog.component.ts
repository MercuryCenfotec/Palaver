import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IInstitution } from 'app/shared/model/institution.model';
import { InstitutionService } from 'app/entities/institution';
import { Membership } from 'app/shared/model/membership.model';
import { Observable } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
    selector: 'jhi-dashboard-institution-confirm-dialog',
    templateUrl: './dashboard-institution-confirm-dialog.component.html'
})
export class DashboardInstitutionConfirmDialogComponent {
    institution: IInstitution;

    constructor(
        protected institutionService: InstitutionService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    obtenerPlanPremium() {
        const premium = new Membership(2);

        this.institution.membership = premium;

        this.subscribeToSaveResponse(this.institutionService.update(this.institution));

        document.getElementById('footerPremium').innerHTML = '';
        document.getElementById('footerPremium').innerHTML = '<i class="btn ft-check font-medium-4 p-0"></i>';
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IInstitution>>) {
        result.subscribe((res: HttpResponse<IInstitution>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {}

    protected onSaveError() {}
}

@Component({
    selector: 'jhi-dashboard-institution-popup',
    template: ''
})
export class DashboardInstitutionPopup implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ institution }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(DashboardInstitutionConfirmDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.institution = institution;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/dashboard-institution', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/dashboard-institution', { outlets: { popup: null } }]);
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
