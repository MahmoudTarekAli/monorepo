import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumCardAlertComponent } from './premium-card-alert.component';

describe('PremiumCardAlertComponent', () => {
  let component: PremiumCardAlertComponent;
  let fixture: ComponentFixture<PremiumCardAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PremiumCardAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiumCardAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
