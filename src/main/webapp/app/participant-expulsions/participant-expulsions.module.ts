import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PalaverSharedModule } from 'app/shared';
import {PARTICIPANT_EXPULSIONS_ROUTE} from 'app/participant-expulsions/participant-expulsions.route';
import {ParticipantExpulsionsComponent} from 'app/participant-expulsions/participant-expulsions.component';

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild([PARTICIPANT_EXPULSIONS_ROUTE])],
    declarations: [ParticipantExpulsionsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverParticipantExpulsionsModule {}
