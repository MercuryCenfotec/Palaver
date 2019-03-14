import { IInstitution } from 'app/shared/model/institution.model';
import { ITestQuestion } from 'app/shared/model/test-question.model';

export interface IAptitudeTest {
    id?: number;
    name?: string;
    createdDate?: string;
    institution?: IInstitution;
    questions?: ITestQuestion[];
}

export class AptitudeTest implements IAptitudeTest {
    constructor(
        public id?: number,
        public name?: string,
        public createdDate?: string,
        public institution?: IInstitution,
        public questions?: ITestQuestion[]
    ) {}
}
