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
import { FocusGroupManagementLoginComponent } from 'app/entities/focus-group/focus-group-management-login.component';
import { FocusGroupManagementComponent } from 'app/entities/focus-group/focus-group-management.component';
import { FocusGroupFilterPipe } from 'app/entities/focus-group/filter.pipe';
import { ParticipantFilterPipe } from 'app/entities/participant/filter.pipe';
import { FocusGroupTestDialogComponent } from 'app/entities/focus-group/focus-group-test-dialog.component';

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
        ParticipateComponent,
        FocusGroupManagementLoginComponent,
        FocusGroupManagementComponent,
        FocusGroupFilterPipe,
        ParticipantFilterPipe,
        FocusGroupTestDialogComponent
    ],
    entryComponents: [
        FocusGroupComponent,
        FocusGroupUpdateComponent,
        FocusGroupDeleteDialogComponent,
        FocusGroupDeletePopupComponent,
        ParticipateComponent,
        FocusGroupManagementLoginComponent,
        FocusGroupManagementComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverFocusGroupModule {}
