import { Entity } from './entity';

export class Version extends Entity {
    number: string;
    originalDocumentation: string;
    oasDocumentation: string;
    metadata: Object;
    description: string;
    deprecated: boolean;
    blacklister: boolean;
    createdAt: boolean;

    constructor(
        number: string,
        originalDocumentation: string,
        description: string
    ) {
        super();
        this.number = number;
        this.originalDocumentation = originalDocumentation;
        this.description = description;
    }
}
