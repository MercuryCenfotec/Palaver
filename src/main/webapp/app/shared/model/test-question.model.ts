import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';

export interface ITestQuestion {
    id?: number;
    question?: string;
    aptitudeTest?: IAptitudeTest;
}

export class TestQuestion implements ITestQuestion {
    constructor(public id?: number, public question?: string, public aptitudeTest?: IAptitudeTest) {}
}
