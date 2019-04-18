import { Moment } from 'moment';
import { IUserApp } from 'app/shared/model/user-app.model';

export interface IMessage {
    id?: number;
    send?: Moment;
    isRead?: boolean;
    message?: string;
    receiver?: IUserApp;
    transmitter?: IUserApp;
}

export class Message implements IMessage {
    constructor(
        public id?: number,
        public send?: Moment,
        public isRead?: boolean,
        public message?: string,
        public receiver?: IUserApp,
        public transmitter?: IUserApp
    ) {
        this.isRead = this.isRead || false;
    }
}
