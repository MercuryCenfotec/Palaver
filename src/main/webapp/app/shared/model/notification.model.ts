export interface INotification {
    id?: number;
    message?: string;
    type?: string;
    isRead?: boolean;
    messageId?: number;
}

export class Notification implements INotification {
    constructor(public id?: number, public message?: string, public type?: string, public isRead?: boolean, public messageId?: number) {
        this.isRead = this.isRead || false;
    }
}
