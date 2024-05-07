import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUsernameComponent } from './confirm-username.component';

describe('ConfirmUsernameComponent', () => {
  let component: ConfirmUsernameComponent;
  let fixture: ComponentFixture<ConfirmUsernameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ConfirmUsernameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
