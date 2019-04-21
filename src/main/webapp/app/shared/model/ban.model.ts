import { IParticipant } from 'app/shared/model/participant.model';
import { IFocusGroup } from 'app/shared/model/focus-group.model';

export interface IBan {
    id?: number;
    reason?: string;
    complaint?: string;
    isValid?: boolean;
    participant?: IParticipant;
    focusGroup?: IFocusGroup;
}

export class Ban implements IBan {
    constructor(
        public id?: number,
        public reason?: string,
        public complaint?: string,
        public isValid?: boolean,
        public participant?: IParticipant,
        public focusGroup?: IFocusGroup
    ) {
        this.isValid = this.isValid || false;
    }
}
