import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TestResult } from 'app/shared/model/test-result.model';
import { TestResultService } from './test-result.service';
import { TestResultComponent } from './test-result.component';
import { TestResultDetailComponent } from './test-result-detail.component';
import { TestResultUpdateComponent } from './test-result-update.component';
import { TestResultDeletePopupComponent } from './test-result-delete-dialog.component';
import { ITestResult } from 'app/shared/model/test-result.model';

@Injectable({ providedIn: 'root' })
export class TestResultResolve implements Resolve<ITestResult> {
    constructor(private service: TestResultService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITestResult> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<TestResult>) => response.ok),
                map((testResult: HttpResponse<TestResult>) => testResult.body)
            );
        }
        return of(new TestResult());
    }
}

export const testResultRoute: Routes = [
    {
        path: '',
        component: TestResultComponent,
        data: {
            authorities: ['ROLE_GROUP', 'ROLE_ADMIN'],
            pageTitle: 'Resultados'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: TestResultDetailComponent,
        resolve: {
            testResult: TestResultResolve
        },
        data: {
            authorities: ['ROLE_INSTITUTION', 'ROLE_ADMIN'],
            pageTitle: 'Resultados'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: TestResultUpdateComponent,
        resolve: {
            testResult: TestResultResolve
        },
        data: {
            authorities: ['ROLE_INSTITUTION', 'ROLE_ADMIN'],
            pageTitle: 'Resultados'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: TestResultUpdateComponent,
        resolve: {
            testResult: TestResultResolve
        },
        data: {
            authorities: ['ROLE_INSTITUTION', 'ROLE_ADMIN'],
            pageTitle: 'Resultados'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const testResultPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: TestResultDeletePopupComponent,
        resolve: {
            testResult: TestResultResolve
        },
        data: {
            authorities: ['ROLE_INSTITUTION', 'ROLE_ADMIN'],
            pageTitle: 'Resultados'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
