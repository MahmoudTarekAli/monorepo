import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaSettingsComponent } from './arena-settings.component';

describe('ArenaSettingsComponent', () => {
  let component: ArenaSettingsComponent;
  let fixture: ComponentFixture<ArenaSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArenaSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArenaSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
