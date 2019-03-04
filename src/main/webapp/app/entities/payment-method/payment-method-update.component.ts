import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IPaymentMethod } from 'app/shared/model/payment-method.model';
import { PaymentMethodService } from './payment-method.service';
import { IUserApp } from 'app/shared/model/user-app.model';
import { UserAppService } from 'app/entities/user-app';

@Component({
    selector: 'jhi-payment-method-update',
    templateUrl: './payment-method-update.component.html'
})
export class PaymentMethodUpdateComponent implements OnInit {
    paymentMethod: IPaymentMethod;
    isSaving: boolean;

    userapps: IUserApp[];
    expirationDateDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected paymentMethodService: PaymentMethodService,
        protected userAppService: UserAppService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ paymentMethod }) => {
            this.paymentMethod = paymentMethod;
        });
        this.userAppService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUserApp[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUserApp[]>) => response.body)
            )
            .subscribe((res: IUserApp[]) => (this.userapps = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.paymentMethod.id !== undefined) {
            this.subscribeToSaveResponse(this.paymentMethodService.update(this.paymentMethod));
        } else {
            this.subscribeToSaveResponse(this.paymentMethodService.create(this.paymentMethod));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaymentMethod>>) {
        result.subscribe((res: HttpResponse<IPaymentMethod>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserAppById(index: number, item: IUserApp) {
        return item.id;
    }
}
