import { Entity } from './entity';

export class User extends Entity {
    username: string;
    email: string;
    password: string;
    description: string;
    role: string;
    logoUrl: string;
    banned: boolean;
    contributions: Array<string>;
    createdAt: Date;
    customToken: string;
    idToken: string;
}
