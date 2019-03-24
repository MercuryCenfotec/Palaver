import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import { FilterPipe } from './filter.pipe';

import {
    MeetingComponent,
    MeetingCreateComponent,
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
        MeetingCreateComponent,
        MeetingDetailComponent,
        MeetingUpdateComponent,
        MeetingDeleteDialogComponent,
        MeetingDeletePopupComponent,
        FilterPipe
    ],
    entryComponents: [MeetingComponent, MeetingUpdateComponent, MeetingDeleteDialogComponent, MeetingDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverMeetingModule {}
