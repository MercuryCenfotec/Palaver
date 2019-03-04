import { IUserApp } from 'app/shared/model/user-app.model';

export interface IBalanceAccount {
    id?: number;
    balance?: number;
    debitBalance?: number;
    creditBalance?: number;
    description?: string;
    user?: IUserApp;
}

export class BalanceAccount implements IBalanceAccount {
    constructor(
        public id?: number,
        public balance?: number,
        public debitBalance?: number,
        public creditBalance?: number,
        public description?: string,
        public user?: IUserApp
    ) {}
}
