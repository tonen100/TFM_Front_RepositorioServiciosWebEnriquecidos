import { Entity } from './entity';

export class Version extends Entity {
    number: string;
    originalDocumentation: string;
    oasDocumentation: string;
    metadata: any;
    urlAPI: string;
    urlDoc: string;
    description: string;
    deprecated: boolean;
    blacklister: boolean;
    createdAt: Date;

    constructor(
        number: string,
        originalDocumentation: string,
        description: string,
        urlAPI: string,
        urlDoc: string
    ) {
        super();
        this.number = number;
        this.originalDocumentation = originalDocumentation;
        this.description = description;
        if (urlAPI != null) { this.urlAPI = urlAPI; }
        if (urlDoc != null) { this.urlDoc = urlDoc; }
    }
}
