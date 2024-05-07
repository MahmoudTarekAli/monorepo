import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityPrivacyComponent } from './security-privacy.component';

describe('SecurityPrivacyComponent', () => {
  let component: SecurityPrivacyComponent;
  let fixture: ComponentFixture<SecurityPrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SecurityPrivacyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
