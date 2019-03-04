import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TestAnswerOption } from 'app/shared/model/test-answer-option.model';
import { TestAnswerOptionService } from './test-answer-option.service';
import { TestAnswerOptionComponent } from './test-answer-option.component';
import { TestAnswerOptionDetailComponent } from './test-answer-option-detail.component';
import { TestAnswerOptionUpdateComponent } from './test-answer-option-update.component';
import { TestAnswerOptionDeletePopupComponent } from './test-answer-option-delete-dialog.component';
import { ITestAnswerOption } from 'app/shared/model/test-answer-option.model';

@Injectable({ providedIn: 'root' })
export class TestAnswerOptionResolve implements Resolve<ITestAnswerOption> {
    constructor(private service: TestAnswerOptionService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITestAnswerOption> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<TestAnswerOption>) => response.ok),
                map((testAnswerOption: HttpResponse<TestAnswerOption>) => testAnswerOption.body)
            );
        }
        return of(new TestAnswerOption());
    }
}

export const testAnswerOptionRoute: Routes = [
    {
        path: '',
        component: TestAnswerOptionComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TestAnswerOptions'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: TestAnswerOptionDetailComponent,
        resolve: {
            testAnswerOption: TestAnswerOptionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TestAnswerOptions'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: TestAnswerOptionUpdateComponent,
        resolve: {
            testAnswerOption: TestAnswerOptionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TestAnswerOptions'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: TestAnswerOptionUpdateComponent,
        resolve: {
            testAnswerOption: TestAnswerOptionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TestAnswerOptions'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const testAnswerOptionPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: TestAnswerOptionDeletePopupComponent,
        resolve: {
            testAnswerOption: TestAnswerOptionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TestAnswerOptions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
