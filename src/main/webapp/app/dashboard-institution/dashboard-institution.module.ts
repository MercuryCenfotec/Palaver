import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import { DashboardInstitutionComponent } from 'app/dashboard-institution/dashboard-institution.component';
import { DASHBOARD_INSTITUTION_ROUTE, dashboardInstitutionPopupRoute } from 'app/dashboard-institution/dashboard-institution.route';
import {
    DashboardInstitutionConfirmDialogComponent,
    DashboardInstitutionPopup
} from 'app/dashboard-institution/dashboard-institution-confirm-dialog.component';
import { NavbarComponent } from 'app/layouts';
import { ChartistModule } from 'ng-chartist';

const ENTITY_STATES = [...DASHBOARD_INSTITUTION_ROUTE, ...dashboardInstitutionPopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES), ChartistModule],
    declarations: [DashboardInstitutionComponent, DashboardInstitutionConfirmDialogComponent, DashboardInstitutionPopup],
    entryComponents: [DashboardInstitutionComponent, DashboardInstitutionPopup, DashboardInstitutionConfirmDialogComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [NavbarComponent]
})
export class PalaverDashboardInstitutionModule {}
