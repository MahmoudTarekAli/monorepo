import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredInputsComponent } from './required-inputs.component';

describe('RequiredInputsComponent', () => {
  let component: RequiredInputsComponent;
  let fixture: ComponentFixture<RequiredInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequiredInputsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequiredInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
