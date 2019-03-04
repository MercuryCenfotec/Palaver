import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import {
    TestAnswerOptionComponent,
    TestAnswerOptionDetailComponent,
    TestAnswerOptionUpdateComponent,
    TestAnswerOptionDeletePopupComponent,
    TestAnswerOptionDeleteDialogComponent,
    testAnswerOptionRoute,
    testAnswerOptionPopupRoute
} from './';

const ENTITY_STATES = [...testAnswerOptionRoute, ...testAnswerOptionPopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        TestAnswerOptionComponent,
        TestAnswerOptionDetailComponent,
        TestAnswerOptionUpdateComponent,
        TestAnswerOptionDeleteDialogComponent,
        TestAnswerOptionDeletePopupComponent
    ],
    entryComponents: [
        TestAnswerOptionComponent,
        TestAnswerOptionUpdateComponent,
        TestAnswerOptionDeleteDialogComponent,
        TestAnswerOptionDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverTestAnswerOptionModule {}
