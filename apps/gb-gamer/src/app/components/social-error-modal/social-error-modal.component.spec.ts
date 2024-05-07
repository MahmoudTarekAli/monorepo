import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialErrorModalComponent } from './social-error-modal.component';

describe('SocialErrorModalComponent', () => {
  let component: SocialErrorModalComponent;
  let fixture: ComponentFixture<SocialErrorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SocialErrorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
