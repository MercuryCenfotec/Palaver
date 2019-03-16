import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TestQuestion } from 'app/shared/model/test-question.model';
import { TestQuestionService } from './test-question.service';
import { TestQuestionComponent } from './test-question.component';
import { TestQuestionDetailComponent } from './test-question-detail.component';
import { TestQuestionUpdateComponent } from './test-question-update.component';
import { TestQuestionDeletePopupComponent } from './test-question-delete-dialog.component';
import { ITestQuestion } from 'app/shared/model/test-question.model';

@Injectable({ providedIn: 'root' })
export class TestQuestionResolve implements Resolve<ITestQuestion> {
    constructor(private service: TestQuestionService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITestQuestion> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<TestQuestion>) => response.ok),
                map((testQuestion: HttpResponse<TestQuestion>) => testQuestion.body)
            );
        }
        return of(new TestQuestion());
    }
}

export const testQuestionRoute: Routes = [
    {
        path: '',
        component: TestQuestionComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TestQuestions'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: TestQuestionDetailComponent,
        resolve: {
            testQuestion: TestQuestionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TestQuestions'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: TestQuestionUpdateComponent,
        resolve: {
            testQuestion: TestQuestionResolve
        },
        data: {
            authorities: ['ROLE_INSTITUTION'],
            pageTitle: 'TestQuestions'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: TestQuestionUpdateComponent,
        resolve: {
            testQuestion: TestQuestionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TestQuestions'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const testQuestionPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: TestQuestionDeletePopupComponent,
        resolve: {
            testQuestion: TestQuestionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TestQuestions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
