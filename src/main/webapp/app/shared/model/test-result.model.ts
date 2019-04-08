import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { IParticipant } from 'app/shared/model/participant.model';

export interface ITestResult {
    id?: number;
    grade?: string;
    status?: string;
    focusGroup?: IFocusGroup;
    participant?: IParticipant;
}

export class TestResult implements ITestResult {
    constructor(
        public id?: number,
        public grade?: string,
        public status?: string,
        public focusGroup?: IFocusGroup,
        public participant?: IParticipant
    ) {}
}
