export interface IIncentive {
    id?: number;
    name?: string;
    image?: string;
    quantity?: number;
    description?: string;
}

export class Incentive implements IIncentive {
    constructor(public id?: number, public name?: string, public image?: string, public quantity?: number, public description?: string) {}
}
