import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import {
    SystemVariableComponent,
    SystemVariableDetailComponent,
    SystemVariableUpdateComponent,
    SystemVariableDeletePopupComponent,
    SystemVariableDeleteDialogComponent,
    systemVariableRoute,
    systemVariablePopupRoute
} from './';

const ENTITY_STATES = [...systemVariableRoute, ...systemVariablePopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        SystemVariableComponent,
        SystemVariableDetailComponent,
        SystemVariableUpdateComponent,
        SystemVariableDeleteDialogComponent,
        SystemVariableDeletePopupComponent
    ],
    entryComponents: [
        SystemVariableComponent,
        SystemVariableUpdateComponent,
        SystemVariableDeleteDialogComponent,
        SystemVariableDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverSystemVariableModule {}
