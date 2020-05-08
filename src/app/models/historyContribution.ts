import { Entity } from './entity';

export class HistoryContribution extends Entity {
    // tslint:disable-next-line: variable-name
    contribution_id: string;
    // tslint:disable-next-line: variable-name
    contributor_id: string;
    date: Date;
    action: string;
    typeContribution: string;
    name: string;
    number: string;
}
