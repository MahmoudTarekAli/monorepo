import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacePlayerComponent } from './replace-player.component';

describe('ReplacePlayerComponent', () => {
  let component: ReplacePlayerComponent;
  let fixture: ComponentFixture<ReplacePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplacePlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
