import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import { DashboardInstitutionComponent } from 'app/dashboard-institution/dashboard-institution.component';
import { DASHBOARD_INSTITUTION_ROUTE } from 'app/dashboard-institution/dashboard-institution.route';

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild([DASHBOARD_INSTITUTION_ROUTE])],
    declarations: [DashboardInstitutionComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverDashboardInstitutionModule {}
