import { Moment } from 'moment';
import { IUserApp } from 'app/shared/model/user-app.model';
import { ICategory } from 'app/shared/model/category.model';
import { IFocusGroup } from 'app/shared/model/focus-group.model';

export const enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    UNDEFINED = 'UNDEFINED'
}

export const enum CivilStatus {
    MARRIED = 'MARRIED',
    WIDOWED = 'WIDOWED',
    SEPARATED = 'SEPARATED',
    DIVORCED = 'DIVORCED',
    SINGLE = 'SINGLE'
}

export interface IParticipant {
    id?: number;
    birthdate?: Moment;
    gender?: Gender;
    civilStatus?: CivilStatus;
    picture?: string;
    user?: IUserApp;
    categories?: ICategory[];
    focusGroups?: IFocusGroup[];
}

export class Participant implements IParticipant {
    constructor(
        public id?: number,
        public birthdate?: Moment,
        public gender?: Gender,
        public civilStatus?: CivilStatus,
        public picture?: string,
        public user?: IUserApp,
        public categories?: ICategory[],
        public focusGroups?: IFocusGroup[]
    ) {}
}
