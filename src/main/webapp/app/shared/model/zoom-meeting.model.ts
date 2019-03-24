import { ZoomRecurrence } from 'app/shared/model/zoom-recurrence.model';
import { ZoomSettings } from 'app/shared/model/zoom-settings.model';

export interface IZoomMeeting {
    id?: number;
    topic?: string;
    type?: number;
    startTime?: Date;
    duration?: number;
    timezone?: string;
    password?: string;
    agenda?: string;
    createdAt?: Date;
    startUrl?: string;
    joinUrl?: string;
    h323Password?: string;
    pstnPassword?: string;
    pmi?: string;
    recurrences?: ZoomRecurrence;
    settings?: ZoomSettings;
}

export class ZoomMeeting implements IZoomMeeting {
    constructor(
        public id?: number,
        public topic?: string,
        public type?: number,
        public startTime?: Date,
        public duration?: number,
        public timezone?: string,
        public password?: string,
        public agenda?: string,
        public createdAt?: Date,
        public startUrl?: string,
        public joinUrl?: string,
        public h323Password?: string,
        public pstnPassword?: string,
        public pmi?: string,
        public recurrences?: ZoomRecurrence,
        public settings?: ZoomSettings
    ) {
        this.id = id ? id : null;
        this.topic = topic ? topic : null;
        this.type = type ? type : null;
        this.startTime = startTime ? startTime : null;
        this.duration = duration ? duration : null;
        this.timezone = timezone ? timezone : 'America/Costa_Rica';
        this.password = password ? password : null;
        this.agenda = agenda ? agenda : null;
        this.createdAt = createdAt ? createdAt : null;
        this.startUrl = startUrl ? startUrl : null;
        this.joinUrl = joinUrl ? joinUrl : null;
        this.h323Password = h323Password ? h323Password : null;
        this.pstnPassword = pstnPassword ? pstnPassword : null;
        this.pmi = pmi ? pmi : null;
        this.recurrences = recurrences ? recurrences : new ZoomRecurrence(startTime);
        this.settings = settings ? settings : new ZoomSettings();
    }
}
