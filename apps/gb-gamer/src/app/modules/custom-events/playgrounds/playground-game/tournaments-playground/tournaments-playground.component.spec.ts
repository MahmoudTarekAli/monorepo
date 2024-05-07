import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentsPlaygroundComponent } from './tournaments-playground.component';

describe('TournamentsPlaygroundComponent', () => {
  let component: TournamentsPlaygroundComponent;
  let fixture: ComponentFixture<TournamentsPlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TournamentsPlaygroundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentsPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
