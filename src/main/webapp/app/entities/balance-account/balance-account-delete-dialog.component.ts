import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBalanceAccount } from 'app/shared/model/balance-account.model';
import { BalanceAccountService } from './balance-account.service';

@Component({
    selector: 'jhi-balance-account-delete-dialog',
    templateUrl: './balance-account-delete-dialog.component.html'
})
export class BalanceAccountDeleteDialogComponent {
    balanceAccount: IBalanceAccount;

    constructor(
        protected balanceAccountService: BalanceAccountService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.balanceAccountService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'balanceAccountListModification',
                content: 'Deleted an balanceAccount'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-balance-account-delete-popup',
    template: ''
})
export class BalanceAccountDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ balanceAccount }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(BalanceAccountDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.balanceAccount = balanceAccount;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/balance-account', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/balance-account', { outlets: { popup: null } }]);
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
