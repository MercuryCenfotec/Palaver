import { IBalanceAccount } from 'app/shared/model/balance-account.model';

export interface IPayment {
    id?: number;
    date?: string;
    description?: string;
    ammount?: number;
    destinyAccount?: IBalanceAccount;
    oringAccount?: IBalanceAccount;
}

export class Payment implements IPayment {
    constructor(
        public id?: number,
        public date?: string,
        public description?: string,
        public ammount?: number,
        public destinyAccount?: IBalanceAccount,
        public oringAccount?: IBalanceAccount
    ) {}
}
