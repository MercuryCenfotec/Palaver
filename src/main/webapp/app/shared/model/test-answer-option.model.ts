import { ITestQuestion } from 'app/shared/model/test-question.model';

export interface ITestAnswerOption {
    id?: number;
    answer?: string;
    desired?: boolean;
    testQuestion?: ITestQuestion;
}

export class TestAnswerOption implements ITestAnswerOption {
    constructor(public id?: number, public answer?: string, public desired?: boolean, public testQuestion?: ITestQuestion) {
        this.desired = this.desired || false;
    }
}
