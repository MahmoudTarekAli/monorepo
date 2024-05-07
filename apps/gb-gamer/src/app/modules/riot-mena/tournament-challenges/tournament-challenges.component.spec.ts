import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentChallengesComponent } from './tournament-challenges.component';

describe('TournamentChallengesComponent', () => {
  let component: TournamentChallengesComponent;
  let fixture: ComponentFixture<TournamentChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TournamentChallengesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
