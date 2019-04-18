import { Moment } from 'moment';
import { IChat } from 'app/shared/model/chat.model';

export interface IMessage {
    id?: number;
    send?: Moment;
    isRead?: boolean;
    message?: string;
    isFocusGroup?: boolean;
    chat?: IChat;
}

export class Message implements IMessage {
    constructor(
        public id?: number,
        public send?: Moment,
        public isRead?: boolean,
        public message?: string,
        public isFocusGroup?: boolean,
        public chat?: IChat
    ) {
        this.isRead = this.isRead || false;
        this.isFocusGroup = this.isFocusGroup || false;
    }
}
