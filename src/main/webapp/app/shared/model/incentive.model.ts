import { IInstitution } from 'app/shared/model/institution.model';
import { IFocusGroup } from 'app/shared/model/focus-group.model';

export interface IIncentive {
    id?: number;
    name?: string;
    image?: string;
    quantity?: number;
    description?: string;
    institution?: IInstitution;
    focusGroups?: IFocusGroup[];
}

export class Incentive implements IIncentive {
    constructor(
        public id?: number,
        public name?: string,
        public image?: string,
        public quantity?: number,
        public description?: string,
        public institution?: IInstitution,
        public focusGroups?: IFocusGroup[]
    ) {}
}
