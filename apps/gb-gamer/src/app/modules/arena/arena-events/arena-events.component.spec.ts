import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaEventsComponent } from './arena-events.component';

describe('ArenaEventsComponent', () => {
  let component: ArenaEventsComponent;
  let fixture: ComponentFixture<ArenaEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArenaEventsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArenaEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
