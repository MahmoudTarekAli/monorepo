import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentLogsComponent } from './tournament-logs.component';

describe('TournamentLogsComponent', () => {
  let component: TournamentLogsComponent;
  let fixture: ComponentFixture<TournamentLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
