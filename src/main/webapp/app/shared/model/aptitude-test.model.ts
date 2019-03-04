import { IInstitution } from 'app/shared/model/institution.model';

export interface IAptitudeTest {
    id?: number;
    name?: string;
    createdDate?: string;
    institution?: IInstitution;
}

export class AptitudeTest implements IAptitudeTest {
    constructor(public id?: number, public name?: string, public createdDate?: string, public institution?: IInstitution) {}
}
