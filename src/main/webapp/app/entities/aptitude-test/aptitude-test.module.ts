import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import {
    AptitudeTestComponent,
    AptitudeTestDetailComponent,
    AptitudeTestUpdateComponent,
    AptitudeTestDeletePopupComponent,
    AptitudeTestDeleteDialogComponent,
    aptitudeTestRoute,
    aptitudeTestPopupRoute
} from './';
import { AptitudeTestFormComponent } from 'app/entities/aptitude-test/aptitude-test-form.component';
import { FilterPipe } from './filter.pipe';

const ENTITY_STATES = [...aptitudeTestRoute, ...aptitudeTestPopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        AptitudeTestComponent,
        AptitudeTestDetailComponent,
        AptitudeTestUpdateComponent,
        AptitudeTestDeleteDialogComponent,
        AptitudeTestDeletePopupComponent,
        AptitudeTestFormComponent,
        FilterPipe
    ],
    entryComponents: [
        AptitudeTestComponent,
        AptitudeTestUpdateComponent,
        AptitudeTestDeleteDialogComponent,
        AptitudeTestDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverAptitudeTestModule {}
