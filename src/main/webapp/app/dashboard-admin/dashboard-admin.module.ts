import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PalaverSharedModule } from 'app/shared';
import { NavbarComponent } from 'app/layouts';
import { ChartistModule } from 'ng-chartist';
import { DASHBOARD_ADMIN_ROUTE } from 'app/dashboard-admin/dashboard-admin.route';
import { DashboardAdminComponent } from 'app/dashboard-admin/dashboard-admin.component';

const ENTITY_STATES = [...DASHBOARD_ADMIN_ROUTE];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES), ChartistModule],
    declarations: [DashboardAdminComponent],
    entryComponents: [DashboardAdminComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [NavbarComponent]
})
export class PalaverDashboardAdminModule {}
