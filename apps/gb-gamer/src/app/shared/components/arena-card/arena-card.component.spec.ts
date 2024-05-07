import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaCardComponent } from './arena-card.component';

describe('ArenaCardComponent', () => {
  let component: ArenaCardComponent;
  let fixture: ComponentFixture<ArenaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArenaCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArenaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
