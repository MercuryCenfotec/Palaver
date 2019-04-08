import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import {
    BanComponent,
    BanDetailComponent,
    BanUpdateComponent,
    BanDeletePopupComponent,
    BanDeleteDialogComponent,
    banRoute,
    banPopupRoute
} from './';

const ENTITY_STATES = [...banRoute, ...banPopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [BanComponent, BanDetailComponent, BanUpdateComponent, BanDeleteDialogComponent, BanDeletePopupComponent],
    entryComponents: [BanComponent, BanUpdateComponent, BanDeleteDialogComponent, BanDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverBanModule {}
