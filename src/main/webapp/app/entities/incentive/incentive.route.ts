import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Incentive } from 'app/shared/model/incentive.model';
import { IncentiveService } from './incentive.service';
import { IncentiveComponent } from './incentive.component';
import { IncentiveDetailComponent } from './incentive-detail.component';
import { IncentiveUpdateComponent } from './incentive-update.component';
import { IncentiveDeletePopupComponent } from './incentive-delete-dialog.component';
import { IIncentive } from 'app/shared/model/incentive.model';
import { IncentiveFormComponent } from 'app/entities/incentive/incentive-form.component';

@Injectable({ providedIn: 'root' })
export class IncentiveResolve implements Resolve<IIncentive> {
    constructor(private service: IncentiveService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IIncentive> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Incentive>) => response.ok),
                map((incentive: HttpResponse<Incentive>) => incentive.body)
            );
        }
        return of(new Incentive());
    }
}

export const incentiveRoute: Routes = [
    {
        path: '',
        component: IncentiveComponent,
        data: {
            authorities: ['ROLE_INSTITUTION'],
            pageTitle: 'Incentives'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: IncentiveDetailComponent,
        resolve: {
            incentive: IncentiveResolve
        },
        data: {
            authorities: ['ROLE_INSTITUTION'],
            pageTitle: 'Incentives'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: IncentiveFormComponent,
        resolve: {
            incentive: IncentiveResolve
        },
        data: {
            authorities: ['ROLE_INSTITUTION'],
            pageTitle: 'Incentives'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: IncentiveUpdateComponent,
        resolve: {
            incentive: IncentiveResolve
        },
        data: {
            authorities: ['ROLE_INSTITUTION'],
            pageTitle: 'Incentives'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const incentivePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: IncentiveDeletePopupComponent,
        resolve: {
            incentive: IncentiveResolve
        },
        data: {
            authorities: ['ROLE_INSTITUTION'],
            pageTitle: 'Incentives'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
