import { Route, Routes } from '@angular/router';
import { DashboardInstitutionComponent } from 'app/dashboard-institution/dashboard-institution.component';
import { UserRouteAccessService } from 'app/core';
import { DashboardInstitutionPopup } from 'app/dashboard-institution/dashboard-institution-confirm-dialog.component';
import { InstitutionResolve } from 'app/entities/institution';

export const DASHBOARD_INSTITUTION_ROUTE: Routes = [
    {
        path: 'dashboard-institution',
        component: DashboardInstitutionComponent,
        data: {
            authorities: ['ROLE_INSTITUTION']
        }
    }
];

export const dashboardInstitutionPopupRoute: Routes = [
    {
        path: 'confirm',
        component: DashboardInstitutionPopup,
        data: {
            authorities: ['ROLE_INSTITUTION'],
            pageTitle: 'Institutions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
