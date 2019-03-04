import { IUserApp } from 'app/shared/model/user-app.model';
import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { IMembership } from 'app/shared/model/membership.model';

export interface IInstitution {
    id?: number;
    name?: string;
    description?: string;
    logo?: string;
    telephone?: string;
    user?: IUserApp;
    aptitudeTests?: IAptitudeTest[];
    membership?: IMembership;
}

export class Institution implements IInstitution {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public logo?: string,
        public telephone?: string,
        public user?: IUserApp,
        public aptitudeTests?: IAptitudeTest[],
        public membership?: IMembership
    ) {}
}
