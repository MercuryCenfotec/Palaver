import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { IBalanceAccount } from 'app/shared/model/balance-account.model';
import { AccountService, UserService } from 'app/core';
import { BalanceAccountService } from './balance-account.service';
import { UserAppService } from 'app/entities/user-app';
import { IUserApp } from 'app/shared/model/user-app.model';

@Component({
    selector: 'jhi-balance-account',
    templateUrl: './balance-account.component.html'
})
export class BalanceAccountComponent implements OnInit, OnDestroy {
    balanceAccounts: IBalanceAccount[];
    currentAccount: any;
    eventSubscriber: Subscription;
    balanceAccount: IBalanceAccount;
    actualBalance: IBalanceAccount;
    formatedBalance: string;
    userApp: IUserApp;

    constructor(
        protected balanceAccountService: BalanceAccountService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected userService: UserService,
        protected userAppService: UserAppService
    ) {}

    ngOnInit() {
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.userAppService.findByUserId(user.id).subscribe(userAppData => {
                this.balanceAccountService.findByUserId(userAppData.id).subscribe(balance => {
                    this.userApp = userAppData;
                    this.actualBalance = balance.body;
                    const formatter = new Intl.NumberFormat('es', {
                        style: 'currency',
                        currency: 'CRC',
                        minimumFractionDigits: 2
                    });
                    this.formatedBalance = formatter.format(balance.body.balance);
                });
            });
        });
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IBalanceAccount) {
        return item.id;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    openCheckout(amountToSubmit: number) {
        const parentReference = this;
        const handler = (<any>window).StripeCheckout.configure({
            key: 'pk_test_h6yLV7URu1btctSqXR1Rsn5y00ExJYJNll',
            locale: 'es',
            token: function(token: any) {
                parentReference.updateNow(token.id, amountToSubmit);
            }
        });

        handler.open({
            name: 'Añadir fondos',
            description: 'Ingresa la información respectiva',
            amount: amountToSubmit,
            currency: 'CRC'
        });
    }

    updateNow(token: string, amount: number) {
        this.balanceAccountService.update(this.actualBalance, token, amount).subscribe(() => {
            this.ngOnInit();
        });
    }

    retrieveFunds() {
        this.balanceAccountService.retrieve(this.userApp.id, '4000056655665556', '5000').subscribe(() => {});
    }
}
