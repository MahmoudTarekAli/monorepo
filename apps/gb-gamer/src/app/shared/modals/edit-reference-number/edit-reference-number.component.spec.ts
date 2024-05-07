import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReferenceNumberComponent } from './edit-reference-number.component';

describe('EditReferenceNumberComponent', () => {
  let component: EditReferenceNumberComponent;
  let fixture: ComponentFixture<EditReferenceNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ EditReferenceNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReferenceNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
