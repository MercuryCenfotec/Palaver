import { Moment } from 'moment';
import { IFocusGroup } from 'app/shared/model/focus-group.model';

export interface IMeeting {
    id?: number;
    date?: Moment;
    time?: Moment;
    name?: string;
    description?: string;
    callURL?: string;
    callCode?: string;
    focusGroup?: IFocusGroup;
}

export class Meeting implements IMeeting {
    constructor(
        public id?: number,
        public date?: Moment,
        public time?: Moment,
        public name?: string,
        public description?: string,
        public callURL?: string,
        public callCode?: string,
        public focusGroup?: IFocusGroup
    ) {}
}
