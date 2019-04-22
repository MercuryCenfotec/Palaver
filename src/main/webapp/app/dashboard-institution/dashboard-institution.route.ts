import { Route } from '@angular/router';
import { DashboardInstitutionComponent } from 'app/dashboard-institution/dashboard-institution.component';

export const DASHBOARD_INSTITUTION_ROUTE: Route = {
    path: 'dashboard-institution',
    component: DashboardInstitutionComponent,
    data: {
        authorities: ['ROLE_INSTITUTION'],
        pageTitle: 'Palaver'
    }
};
