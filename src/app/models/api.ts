import { Entity } from './entity';
import { Version } from './version';

export class API extends Entity {
    name: string;
    // tslint:disable-next-line: ban-types
    metadata: Object;
    logoUrl: string;
    businessModels: Array<string>;
    blacklisted: boolean;
    versions: Array<Version>;
    providerId: string;

    constructor(
        name: string,
        logoUrl: string,
        businessModels: Array<string>,
    ) {
        super();
        this.name = name;
        this.logoUrl = logoUrl;
        this.businessModels = businessModels;
    }
}
