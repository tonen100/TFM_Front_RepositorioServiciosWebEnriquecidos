import { TestBed } from '@angular/core/testing';

import { ContributionHistoryService } from './contributionHistory.service';

describe('ContributionHistoryService', () => {
  let service: ContributionHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContributionHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
