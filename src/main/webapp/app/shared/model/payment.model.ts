import { IBalanceAccount } from 'app/shared/model/balance-account.model';

export interface IPayment {
    id?: number;
    date?: string;
    description?: string;
    ammount?: number;
    onHold?: boolean;
    destinyAccount?: IBalanceAccount;
    originAccount?: IBalanceAccount;
}

export class Payment implements IPayment {
    constructor(
        public id?: number,
        public date?: string,
        public description?: string,
        public ammount?: number,
        public onHold?: boolean,
        public destinyAccount?: IBalanceAccount,
        public originAccount?: IBalanceAccount
    ) {
        this.onHold = this.onHold || false;
    }
}
