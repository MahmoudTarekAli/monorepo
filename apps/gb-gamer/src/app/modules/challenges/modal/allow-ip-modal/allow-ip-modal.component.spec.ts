import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowIpModalComponent } from './allow-ip-modal.component';

describe('AllowIpModalComponent', () => {
  let component: AllowIpModalComponent;
  let fixture: ComponentFixture<AllowIpModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AllowIpModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllowIpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
