import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import {
    FocusGroupComponent,
    FocusGroupDetailComponent,
    FocusGroupUpdateComponent,
    FocusGroupDeletePopupComponent,
    FocusGroupDeleteDialogComponent,
    focusGroupRoute,
    focusGroupPopupRoute,
    ParticipateComponent
} from './';
import { FocusGroupFormComponent } from 'app/entities/focus-group/focus-group-form.component';

const ENTITY_STATES = [...focusGroupRoute, ...focusGroupPopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        FocusGroupComponent,
        FocusGroupDetailComponent,
        FocusGroupUpdateComponent,
        FocusGroupDeleteDialogComponent,
        FocusGroupDeletePopupComponent,
        FocusGroupFormComponent,
        ParticipateComponent
    ],
    entryComponents: [FocusGroupComponent, FocusGroupUpdateComponent, FocusGroupDeleteDialogComponent, FocusGroupDeletePopupComponent, ParticipateComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverFocusGroupModule {}
