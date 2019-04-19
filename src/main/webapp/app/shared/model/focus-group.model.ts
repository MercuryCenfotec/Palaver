import { Moment } from 'moment';
import { IIncentive } from 'app/shared/model/incentive.model';
import { IInstitution } from 'app/shared/model/institution.model';
import { ICategory } from 'app/shared/model/category.model';
import { IParticipant } from 'app/shared/model/participant.model';
import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { IMeeting } from 'app/shared/model/meeting.model';

export interface IFocusGroup {
    id?: number;
    name?: string;
    description?: string;
    beginDate?: Moment;
    endDate?: Moment;
    code?: string;
    passingGrade?: number;
    participantsAmount?: number;
    status?: string;
    isCompleted?: boolean;
    meetingIsDone?: boolean;
    incentive?: IIncentive;
    institution?: IInstitution;
    categories?: ICategory[];
    participants?: IParticipant[];
    aptitudeTest?: IAptitudeTest;
    meeting?: IMeeting;
}

export class FocusGroup implements IFocusGroup {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public beginDate?: Moment,
        public endDate?: Moment,
        public code?: string,
        public passingGrade?: number,
        public participantsAmount?: number,
        public status?: string,
        public isCompleted?: boolean,
        public meetingIsDone?: boolean,
        public incentive?: IIncentive,
        public institution?: IInstitution,
        public categories?: ICategory[],
        public participants?: IParticipant[],
        public aptitudeTest?: IAptitudeTest,
        public meeting?: IMeeting
    ) {
        this.isCompleted = this.isCompleted || false;
        this.meetingIsDone = this.meetingIsDone || false;
    }
}
