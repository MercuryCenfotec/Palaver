import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import { messageRoute } from './';
import { MessageDeleteDialogComponent, MessageDeletePopupComponent } from 'app/entities/message/message-delete-dialog.component';
import { MessageDetailComponent } from 'app/entities/message/message-detail.component';
import { MessageUpdateComponent } from 'app/entities/message/message-update.component';
import { MessageComponent } from 'app/entities/message/message.component';

const ENTITY_STATES = [...messageRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        MessageDeleteDialogComponent,
        MessageDeletePopupComponent,
        MessageDetailComponent,
        MessageUpdateComponent,
        MessageComponent
    ],
    entryComponents: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverMessageModule {}
