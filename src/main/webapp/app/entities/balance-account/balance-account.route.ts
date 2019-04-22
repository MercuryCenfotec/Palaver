import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BalanceAccount } from 'app/shared/model/balance-account.model';
import { BalanceAccountService } from './balance-account.service';
import { BalanceAccountComponent } from './balance-account.component';
import { BalanceAccountDetailComponent } from './balance-account-detail.component';
import { BalanceAccountUpdateComponent } from './balance-account-update.component';
import { BalanceAccountDeletePopupComponent } from './balance-account-delete-dialog.component';
import { IBalanceAccount } from 'app/shared/model/balance-account.model';

@Injectable({ providedIn: 'root' })
export class BalanceAccountResolve implements Resolve<IBalanceAccount> {
    constructor(private service: BalanceAccountService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IBalanceAccount> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<BalanceAccount>) => response.ok),
                map((balanceAccount: HttpResponse<BalanceAccount>) => balanceAccount.body)
            );
        }
        return of(new BalanceAccount());
    }
}

export const balanceAccountRoute: Routes = [
    {
        path: '',
        component: BalanceAccountComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Balance'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: BalanceAccountDetailComponent,
        resolve: {
            balanceAccount: BalanceAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Balance'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: BalanceAccountUpdateComponent,
        resolve: {
            balanceAccount: BalanceAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Balance'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: BalanceAccountUpdateComponent,
        resolve: {
            balanceAccount: BalanceAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Balance'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const balanceAccountPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: BalanceAccountDeletePopupComponent,
        resolve: {
            balanceAccount: BalanceAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Balance'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
