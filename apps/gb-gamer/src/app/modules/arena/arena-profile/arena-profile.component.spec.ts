import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaProfileComponent } from './arena-profile.component';

describe('ArenaProfileComponent', () => {
  let component: ArenaProfileComponent;
  let fixture: ComponentFixture<ArenaProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArenaProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArenaProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
