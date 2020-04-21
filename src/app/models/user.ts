import { Entity } from './entity';

export class User extends Entity {
    username: string;
    email: string;
    password: string;
    role: string;
    banned: boolean;
    contributions: Array<string>;
    createdAt: Date;
    customToken: string;
    idToken: string;
}
