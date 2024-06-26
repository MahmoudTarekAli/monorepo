import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentParticipantsComponent } from './tournament-participants.component';

describe('TournamentParticipantsComponent', () => {
  let component: TournamentParticipantsComponent;
  let fixture: ComponentFixture<TournamentParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentParticipantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
