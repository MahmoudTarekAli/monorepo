import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinnersModalComponent } from './winners-modal.component';

describe('WinnersModalComponent', () => {
  let component: WinnersModalComponent;
  let fixture: ComponentFixture<WinnersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinnersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WinnersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
