import { Entity } from './entity';

export class ContributionHistory extends Entity {
    contributionId: string;
    contributorId: string;
    date: string;
    action: string;
    typeContribution: string;
}
