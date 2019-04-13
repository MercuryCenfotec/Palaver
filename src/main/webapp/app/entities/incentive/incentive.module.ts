import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import {
    IncentiveComponent,
    IncentiveDetailComponent,
    IncentiveUpdateComponent,
    IncentiveDeletePopupComponent,
    IncentiveDeleteDialogComponent,
    incentiveRoute,
    incentivePopupRoute
} from './';
import { IncentiveFormComponent } from 'app/entities/incentive/incentive-form.component';
import { IncentiveFilterPipe } from 'app/entities/incentive/filter.pipe';

const ENTITY_STATES = [...incentiveRoute, ...incentivePopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        IncentiveComponent,
        IncentiveDetailComponent,
        IncentiveUpdateComponent,
        IncentiveDeleteDialogComponent,
        IncentiveDeletePopupComponent,
        IncentiveFormComponent,
        IncentiveFilterPipe
    ],
    entryComponents: [IncentiveComponent, IncentiveUpdateComponent, IncentiveDeleteDialogComponent, IncentiveDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverIncentiveModule {}
