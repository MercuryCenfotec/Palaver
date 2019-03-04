export interface IMembership {
    id?: number;
    typeMembership?: string;
    cost?: number;
    duration?: number;
}

export class Membership implements IMembership {
    constructor(public id?: number, public typeMembership?: string, public cost?: number, public duration?: number) {}
}
