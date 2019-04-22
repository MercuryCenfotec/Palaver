import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPayment } from 'app/shared/model/payment.model';
import { AccountService } from 'app/core';
import { PaymentService } from './payment.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-payment',
    templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit, OnDestroy {
    payments: IPayment[];
    currentAccount: any;
    eventSubscriber: Subscription;
    pay: IPayment;

    constructor(
        protected paymentService: PaymentService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected modalService: NgbModal
    ) {}

    loadAll() {
        this.paymentService
            .query()
            .pipe(
                filter((res: HttpResponse<IPayment[]>) => res.ok),
                map((res: HttpResponse<IPayment[]>) => res.body)
            )
            .subscribe(
                (res: IPayment[]) => {
                    this.payments = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInPayments();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPayment) {
        return item.id;
    }

    registerChangeInPayments() {
        this.eventSubscriber = this.eventManager.subscribe('paymentListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    showDetail(content, pay) {
        this.pay = pay;
        this.openModal(content);
    }

    openModal(content) {
        this.modalService.open(content).result.then(
            result => {
                console.log(`Closed with: ${result}`);
            },
            reason => {
                console.log(`Dismissed ${this.getDismissReason(reason)}`);
            }
        );
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
}
