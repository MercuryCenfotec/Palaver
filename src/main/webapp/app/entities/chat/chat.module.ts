import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import {
    ChatComponent,
    ChatDetailComponent,
    ChatUpdateComponent,
    ChatDeletePopupComponent,
    ChatDeleteDialogComponent,
    chatRoute,
    chatPopupRoute
} from './';
import { ChatFilterPipe } from 'app/entities/chat/filter.pipe';

const ENTITY_STATES = [...chatRoute, ...chatPopupRoute];

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ChatComponent,
        ChatDetailComponent,
        ChatUpdateComponent,
        ChatDeleteDialogComponent,
        ChatDeletePopupComponent,
        ChatFilterPipe
    ],
    entryComponents: [ChatComponent, ChatUpdateComponent, ChatDeleteDialogComponent, ChatDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverChatModule {}
