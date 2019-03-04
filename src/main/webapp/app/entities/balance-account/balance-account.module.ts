import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import {
    BalanceAccountComponent,
    BalanceAccountDetailComponent,
    BalanceAccountUpdateComponent,
    BalanceAccountDeletePopupComponent,
    BalanceAccountDeleteDialogComponent,
    balanceAccountRoute,
    balanceAccountPopupRoute
} from './';

const ENTITY_STATES = [...balanceAccountRoute, ...balanceAccountPopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        BalanceAccountComponent,
        BalanceAccountDetailComponent,
        BalanceAccountUpdateComponent,
        BalanceAccountDeleteDialogComponent,
        BalanceAccountDeletePopupComponent
    ],
    entryComponents: [
        BalanceAccountComponent,
        BalanceAccountUpdateComponent,
        BalanceAccountDeleteDialogComponent,
        BalanceAccountDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverBalanceAccountModule {}
