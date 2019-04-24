import { Moment } from 'moment';
import { IParticipant } from 'app/shared/model/participant.model';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { IMessage } from 'app/shared/model/message.model';

export interface IChat {
    id?: number;
    lastSend?: Moment;
    lastMessage?: string;
    participant?: IParticipant;
    focusGroup?: IFocusGroup;
    messages?: IMessage[];
}

export class Chat implements IChat {
    constructor(
        public id?: number,
        public lastSend?: Moment,
        public lastMessage?: string,
        public participant?: IParticipant,
        public focusGroup?: IFocusGroup,
        public messages?: IMessage[]
    ) {}
}
