import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import {
    MeetingComponent,
    MeetingDetailComponent,
    MeetingUpdateComponent,
    MeetingDeletePopupComponent,
    MeetingDeleteDialogComponent,
    meetingRoute,
    meetingPopupRoute
} from './';

const ENTITY_STATES = [...meetingRoute, ...meetingPopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        MeetingComponent,
        MeetingDetailComponent,
        MeetingUpdateComponent,
        MeetingDeleteDialogComponent,
        MeetingDeletePopupComponent
    ],
    entryComponents: [MeetingComponent, MeetingUpdateComponent, MeetingDeleteDialogComponent, MeetingDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverMeetingModule {}
