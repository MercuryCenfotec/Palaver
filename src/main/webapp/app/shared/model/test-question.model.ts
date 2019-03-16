import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { ITestAnswerOption } from 'app/shared/model/test-answer-option.model';

export interface ITestQuestion {
    id?: number;
    question?: string;
    aptitudeTest?: IAptitudeTest;
    answers?: ITestAnswerOption[];
}

export class TestQuestion implements ITestQuestion {
    constructor(public id?: number, public question?: string, public aptitudeTest?: IAptitudeTest, public answers?: ITestAnswerOption[]) {}
}
