import { Moment } from 'moment';
import { IUserApp } from 'app/shared/model/user-app.model';

export interface IPaymentMethod {
    id?: number;
    cardNumber?: number;
    expirationDate?: Moment;
    cardName?: string;
    cardCVV?: number;
    user?: IUserApp;
}

export class PaymentMethod implements IPaymentMethod {
    constructor(
        public id?: number,
        public cardNumber?: number,
        public expirationDate?: Moment,
        public cardName?: string,
        public cardCVV?: number,
        public user?: IUserApp
    ) {}
}
