import { Entity } from './entity';
import { Version } from './version';

export class API extends Entity {
    name: string;
    // tslint:disable-next-line: ban-types
    metadata: any;
    logoUrl: string;
    blacklisted: boolean;
    versions: Array<Version>;
    businessModels: Array<string>;
    // tslint:disable-next-line: variable-name
    provider_id: string;

    constructor(
        name: string,
        logoUrl: string,
    ) {
        super();
        this.name = name;
        this.logoUrl = logoUrl;
    }
}
