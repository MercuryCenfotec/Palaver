import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IBalanceAccount } from 'app/shared/model/balance-account.model';
import { BalanceAccountService } from './balance-account.service';
import { IUserApp } from 'app/shared/model/user-app.model';
import { UserAppService } from 'app/entities/user-app';

@Component({
    selector: 'jhi-balance-account-update',
    templateUrl: './balance-account-update.component.html'
})
export class BalanceAccountUpdateComponent implements OnInit {
    balanceAccount: IBalanceAccount;
    isSaving: boolean;

    users: IUserApp[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected balanceAccountService: BalanceAccountService,
        protected userAppService: UserAppService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ balanceAccount }) => {
            this.balanceAccount = balanceAccount;
        });
        this.userAppService
            .query({ filter: 'balanceaccount-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IUserApp[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUserApp[]>) => response.body)
            )
            .subscribe(
                (res: IUserApp[]) => {
                    if (!this.balanceAccount.user || !this.balanceAccount.user.id) {
                        this.users = res;
                    } else {
                        this.userAppService
                            .find(this.balanceAccount.user.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IUserApp>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IUserApp>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IUserApp) => (this.users = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.balanceAccount.id !== undefined) {
            this.subscribeToSaveResponse(this.balanceAccountService.update(this.balanceAccount, '', 0));
        } else {
            this.subscribeToSaveResponse(this.balanceAccountService.create(this.balanceAccount));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IBalanceAccount>>) {
        result.subscribe((res: HttpResponse<IBalanceAccount>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
