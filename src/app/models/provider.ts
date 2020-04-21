import { Entity } from './entity';

export class Provider extends Entity {
    name: string;
    logoUrl: string;
    description: string;
    blacklisted: boolean;
    externalLinks: Array<string>;

    constructor(
        name: string,
        logoUrl: string,
        description: string,
        externalLinks: Array<string>
    ) {
       super();
       this.name = name;
       this.logoUrl = logoUrl;
       this.description = description;
       this.externalLinks = externalLinks;
    }
}
