import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AptitudeTest } from 'app/shared/model/aptitude-test.model';
import { AptitudeTestService } from './aptitude-test.service';
import { AptitudeTestComponent } from './aptitude-test.component';
import { AptitudeTestDetailComponent } from './aptitude-test-detail.component';
import { AptitudeTestUpdateComponent } from './aptitude-test-update.component';
import { AptitudeTestDeletePopupComponent } from './aptitude-test-delete-dialog.component';
import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';

@Injectable({ providedIn: 'root' })
export class AptitudeTestResolve implements Resolve<IAptitudeTest> {
    constructor(private service: AptitudeTestService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAptitudeTest> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<AptitudeTest>) => response.ok),
                map((aptitudeTest: HttpResponse<AptitudeTest>) => aptitudeTest.body)
            );
        }
        return of(new AptitudeTest());
    }
}

export const aptitudeTestRoute: Routes = [
    {
        path: '',
        component: AptitudeTestComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'AptitudeTests'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: AptitudeTestDetailComponent,
        resolve: {
            aptitudeTest: AptitudeTestResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'AptitudeTests'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: AptitudeTestUpdateComponent,
        resolve: {
            aptitudeTest: AptitudeTestResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'AptitudeTests'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: AptitudeTestUpdateComponent,
        resolve: {
            aptitudeTest: AptitudeTestResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'AptitudeTests'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const aptitudeTestPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: AptitudeTestDeletePopupComponent,
        resolve: {
            aptitudeTest: AptitudeTestResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'AptitudeTests'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
