import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBan } from 'app/shared/model/ban.model';
import { BanService } from './ban.service';

@Component({
    selector: 'jhi-ban-delete-dialog',
    templateUrl: './ban-delete-dialog.component.html'
})
export class BanDeleteDialogComponent {
    ban: IBan;

    constructor(protected banService: BanService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.banService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'banListModification',
                content: 'Deleted an ban'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-ban-delete-popup',
    template: ''
})
export class BanDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ ban }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(BanDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.ban = ban;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/ban', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/ban', { outlets: { popup: null } }]);
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
