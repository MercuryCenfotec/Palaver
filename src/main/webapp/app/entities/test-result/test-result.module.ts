import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import {
    TestResultComponent,
    TestResultDetailComponent,
    TestResultUpdateComponent,
    TestResultDeletePopupComponent,
    TestResultDeleteDialogComponent,
    testResultRoute,
    testResultPopupRoute
} from './';
import { TestResultFilterPipe } from 'app/entities/test-result/filter.pipe';
import { TestParticipantFilterPipe } from 'app/entities/test-result/test-participant-filter.pipe';
import { NumberOnlyDirective } from 'app/shared/util/number-directive';

const ENTITY_STATES = [...testResultRoute, ...testResultPopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        TestResultComponent,
        TestResultDetailComponent,
        TestResultUpdateComponent,
        TestResultDeleteDialogComponent,
        TestResultDeletePopupComponent,
        TestResultFilterPipe,
        TestParticipantFilterPipe,
        NumberOnlyDirective
    ],
    entryComponents: [TestResultComponent, TestResultUpdateComponent, TestResultDeleteDialogComponent, TestResultDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverTestResultModule {}
