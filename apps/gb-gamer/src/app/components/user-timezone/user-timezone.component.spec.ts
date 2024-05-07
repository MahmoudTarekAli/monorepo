import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTimezoneComponent } from './user-timezone.component';

describe('UserTimezoneComponent', () => {
  let component: UserTimezoneComponent;
  let fixture: ComponentFixture<UserTimezoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UserTimezoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTimezoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
