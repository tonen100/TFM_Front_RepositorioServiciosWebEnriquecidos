import { TestBed } from '@angular/core/testing';

import { HistoryContributionService } from './historyContribution.service';

describe('HistoryContributionService', () => {
  let service: HistoryContributionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryContributionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
