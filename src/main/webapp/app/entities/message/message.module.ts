import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import { messageRoute } from './';
import { MessageDeleteDialogComponent } from 'app/entities/message/message-delete-dialog.component';

const ENTITY_STATES = [...messageRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [MessageDeleteDialogComponent],
    entryComponents: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverMessageModule {}
