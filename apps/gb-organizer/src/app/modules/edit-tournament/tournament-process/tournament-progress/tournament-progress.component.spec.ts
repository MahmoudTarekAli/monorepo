import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentProgressComponent } from './tournament-progress.component';

describe('TournamentProgressComponent', () => {
  let component: TournamentProgressComponent;
  let fixture: ComponentFixture<TournamentProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
