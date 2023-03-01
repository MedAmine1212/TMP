import { TestBed } from '@angular/core/testing';

import { ScrumTeamService } from './scrum-team.service';

describe('ScrumTeamService', () => {
  let service: ScrumTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrumTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
