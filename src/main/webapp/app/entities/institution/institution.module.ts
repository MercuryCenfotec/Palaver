import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import {
    InstitutionComponent,
    InstitutionDetailComponent,
    InstitutionUpdateComponent,
    InstitutionDeletePopupComponent,
    InstitutionDeleteDialogComponent,
    InstitutionFormComponent,
    institutionRoute,
    institutionPopupRoute
} from './';

const ENTITY_STATES = [...institutionRoute, ...institutionPopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        InstitutionComponent,
        InstitutionDetailComponent,
        InstitutionUpdateComponent,
        InstitutionDeleteDialogComponent,
        InstitutionDeletePopupComponent,
        InstitutionFormComponent
    ],
    entryComponents: [InstitutionComponent, InstitutionUpdateComponent, InstitutionFormComponent, InstitutionDeleteDialogComponent, InstitutionDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverInstitutionModule {}
