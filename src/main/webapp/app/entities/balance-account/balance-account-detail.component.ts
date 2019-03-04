import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBalanceAccount } from 'app/shared/model/balance-account.model';

@Component({
    selector: 'jhi-balance-account-detail',
    templateUrl: './balance-account-detail.component.html'
})
export class BalanceAccountDetailComponent implements OnInit {
    balanceAccount: IBalanceAccount;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ balanceAccount }) => {
            this.balanceAccount = balanceAccount;
        });
    }

    previousState() {
        window.history.back();
    }
}
