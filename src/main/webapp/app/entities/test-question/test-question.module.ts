import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import {
    TestQuestionComponent,
    TestQuestionDetailComponent,
    TestQuestionUpdateComponent,
    TestQuestionDeletePopupComponent,
    TestQuestionDeleteDialogComponent,
    testQuestionRoute,
    testQuestionPopupRoute
} from './';

const ENTITY_STATES = [...testQuestionRoute, ...testQuestionPopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        TestQuestionComponent,
        TestQuestionDetailComponent,
        TestQuestionUpdateComponent,
        TestQuestionDeleteDialogComponent,
        TestQuestionDeletePopupComponent
    ],
    entryComponents: [
        TestQuestionComponent,
        TestQuestionUpdateComponent,
        TestQuestionDeleteDialogComponent,
        TestQuestionDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverTestQuestionModule {}
