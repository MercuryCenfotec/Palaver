export interface ISystemVariable {
    id?: number;
    name?: string;
    code?: string;
    value?: string;
}

export class SystemVariable implements ISystemVariable {
    constructor(public id?: number, public name?: string, public code?: string, public value?: string) {}
}
