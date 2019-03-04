import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import {
    MembershipComponent,
    MembershipDetailComponent,
    MembershipUpdateComponent,
    MembershipDeletePopupComponent,
    MembershipDeleteDialogComponent,
    membershipRoute,
    membershipPopupRoute
} from './';

const ENTITY_STATES = [...membershipRoute, ...membershipPopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        MembershipComponent,
        MembershipDetailComponent,
        MembershipUpdateComponent,
        MembershipDeleteDialogComponent,
        MembershipDeletePopupComponent
    ],
    entryComponents: [MembershipComponent, MembershipUpdateComponent, MembershipDeleteDialogComponent, MembershipDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverMembershipModule {}
