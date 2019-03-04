import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { IParticipant } from 'app/shared/model/participant.model';

export interface ICategory {
    id?: number;
    name?: string;
    description?: string;
    focusGroups?: IFocusGroup[];
    participants?: IParticipant[];
}

export class Category implements ICategory {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public focusGroups?: IFocusGroup[],
        public participants?: IParticipant[]
    ) {}
}
