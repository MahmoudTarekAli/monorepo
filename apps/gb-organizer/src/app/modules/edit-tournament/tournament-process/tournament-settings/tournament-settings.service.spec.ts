import { TestBed } from '@angular/core/testing';

import { TournamentSettingsService } from './tournament-settings.service';

describe('TournamentSettingsService', () => {
  let service: TournamentSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TournamentSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
