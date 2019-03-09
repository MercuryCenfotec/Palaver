import { IUser } from 'app/core/user/user.model';

export interface IUserApp {
    id?: number;
    name?: string;
    identificationNumber?: string;
    mail?: string;
    address?: string;
    password?: string;
    rol?: string;
    user?: IUser;
}

export class UserApp implements IUserApp {
    constructor(
        public id?: number,
        public name?: string,
        public identificationNumber?: string,
        public mail?: string,
        public address?: string,
        public password?: string,
        public rol?: string,
        public user?: IUser
    ) {}
}
