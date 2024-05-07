import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GbPremiumMainComponent } from './gb-premium-main.component';

describe('GbPremiumMainComponent', () => {
  let component: GbPremiumMainComponent;
  let fixture: ComponentFixture<GbPremiumMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GbPremiumMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GbPremiumMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
