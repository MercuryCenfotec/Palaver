import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import {
    UserAppComponent,
    UserAppDetailComponent,
    UserAppUpdateComponent,
    UserAppDeletePopupComponent,
    UserAppDeleteDialogComponent,
    userAppRoute,
    userAppPopupRoute
} from './';
import { ActivitiesDetailComponent } from './activities-detail.component';
import { FilterPipe } from 'app/entities/user-app/filter.pipe';

const ENTITY_STATES = [...userAppRoute, ...userAppPopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        UserAppComponent,
        UserAppDetailComponent,
        UserAppUpdateComponent,
        UserAppDeleteDialogComponent,
        UserAppDeletePopupComponent,
        ActivitiesDetailComponent,
        FilterPipe
    ],
    entryComponents: [
        UserAppComponent,
        UserAppUpdateComponent,
        UserAppDeleteDialogComponent,
        UserAppDeletePopupComponent,
        ActivitiesDetailComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverUserAppModule {}
