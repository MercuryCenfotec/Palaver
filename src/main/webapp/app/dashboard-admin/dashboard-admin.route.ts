import { Route, Routes } from '@angular/router';
import { DashboardAdminComponent } from 'app/dashboard-admin/dashboard-admin.component';

export const DASHBOARD_ADMIN_ROUTE: Routes = [
    {
        path: 'dashboard-admin',
        component: DashboardAdminComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Palaver'
        }
    }
];
