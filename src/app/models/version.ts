import { Entity } from './entity';

export class Version extends Entity {
    number: string;
    originalDocumentation: string;
    oasDocumentation: string;
    metadata: any;
    businessModels: Array<string>;
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
        businessModels: Array<string>,
        urlAPI: string,
        urlDoc: string
    ) {
        super();
        this.number = number;
        this.originalDocumentation = originalDocumentation;
        this.description = description;
        this.businessModels = businessModels;

        if (urlAPI != null) { this.urlAPI = urlAPI; }
        if (urlDoc != null) { this.urlDoc = urlDoc; }
    }
}
