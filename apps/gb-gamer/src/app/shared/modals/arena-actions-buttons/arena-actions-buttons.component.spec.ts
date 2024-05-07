import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaActionsButtonsComponent } from './arena-actions-buttons.component';

describe('ArenaActionsButtonsComponent', () => {
  let component: ArenaActionsButtonsComponent;
  let fixture: ComponentFixture<ArenaActionsButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArenaActionsButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArenaActionsButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
