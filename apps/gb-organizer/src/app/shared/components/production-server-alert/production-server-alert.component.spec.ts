import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionServerAlertComponent } from './production-server-alert.component';

describe('ProductionServerAlertComponent', () => {
  let component: ProductionServerAlertComponent;
  let fixture: ComponentFixture<ProductionServerAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ProductionServerAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionServerAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
