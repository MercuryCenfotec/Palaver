import { Moment } from 'moment';
import { IIncentive } from 'app/shared/model/incentive.model';
import { IInstitution } from 'app/shared/model/institution.model';
import { ICategory } from 'app/shared/model/category.model';
import { IParticipant } from 'app/shared/model/participant.model';

export interface IFocusGroup {
    id?: number;
    name?: string;
    description?: string;
    beginDate?: Moment;
    endDate?: Moment;
    code?: string;
    incentive?: IIncentive;
    institution?: IInstitution;
    categories?: ICategory[];
    participants?: IParticipant[];
}

export class FocusGroup implements IFocusGroup {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public beginDate?: Moment,
        public endDate?: Moment,
        public code?: string,
        public incentive?: IIncentive,
        public institution?: IInstitution,
        public categories?: ICategory[],
        public participants?: IParticipant[]
    ) {}
}
