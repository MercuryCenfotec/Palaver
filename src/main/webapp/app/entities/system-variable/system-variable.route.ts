import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SystemVariable } from 'app/shared/model/system-variable.model';
import { SystemVariableService } from './system-variable.service';
import { SystemVariableComponent } from './system-variable.component';
import { SystemVariableDetailComponent } from './system-variable-detail.component';
import { SystemVariableUpdateComponent } from './system-variable-update.component';
import { SystemVariableDeletePopupComponent } from './system-variable-delete-dialog.component';
import { ISystemVariable } from 'app/shared/model/system-variable.model';

@Injectable({ providedIn: 'root' })
export class SystemVariableResolve implements Resolve<ISystemVariable> {
    constructor(private service: SystemVariableService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ISystemVariable> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<SystemVariable>) => response.ok),
                map((systemVariable: HttpResponse<SystemVariable>) => systemVariable.body)
            );
        }
        return of(new SystemVariable());
    }
}

export const systemVariableRoute: Routes = [
    {
        path: '',
        component: SystemVariableComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SystemVariables'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: SystemVariableDetailComponent,
        resolve: {
            systemVariable: SystemVariableResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SystemVariables'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: SystemVariableUpdateComponent,
        resolve: {
            systemVariable: SystemVariableResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SystemVariables'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: SystemVariableUpdateComponent,
        resolve: {
            systemVariable: SystemVariableResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SystemVariables'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const systemVariablePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: SystemVariableDeletePopupComponent,
        resolve: {
            systemVariable: SystemVariableResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SystemVariables'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
