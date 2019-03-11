import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Institution } from 'app/shared/model/institution.model';
import { InstitutionService } from './institution.service';
import { InstitutionComponent } from './institution.component';
import { InstitutionDetailComponent } from './institution-detail.component';
import { InstitutionUpdateComponent } from './institution-update.component';
import { InstitutionDeletePopupComponent } from './institution-delete-dialog.component';
import { IInstitution } from 'app/shared/model/institution.model';
import { InstitutionFormComponent } from 'app/entities/institution/institution-form.component';

@Injectable({ providedIn: 'root' })
export class InstitutionResolve implements Resolve<IInstitution> {
    constructor(private service: InstitutionService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IInstitution> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Institution>) => response.ok),
                map((institution: HttpResponse<Institution>) => institution.body)
            );
        }
        return of(new Institution());
    }
}

export const institutionRoute: Routes = [
    {
        path: '',
        component: InstitutionComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Institutions'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: InstitutionDetailComponent,
        resolve: {
            institution: InstitutionResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Institutions'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: InstitutionFormComponent,
        resolve: {
            institution: InstitutionResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Institutions'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: InstitutionUpdateComponent,
        resolve: {
            institution: InstitutionResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Institutions'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const institutionPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: InstitutionDeletePopupComponent,
        resolve: {
            institution: InstitutionResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Institutions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
