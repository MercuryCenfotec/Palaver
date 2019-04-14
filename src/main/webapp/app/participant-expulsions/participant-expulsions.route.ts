import { Route } from '@angular/router';
import {ParticipantExpulsionsComponent} from "app/participant-expulsions/participant-expulsions.component";

export const PARTICIPANT_EXPULSIONS_ROUTE: Route = {
    path: 'participants-expulsions',
    component: ParticipantExpulsionsComponent,
    data: {
        authorities: ['ROLE_PARTICIPANT']
    }
};
