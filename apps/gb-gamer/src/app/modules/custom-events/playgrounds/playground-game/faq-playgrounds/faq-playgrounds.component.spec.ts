import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqPlaygroundsComponent } from './faq-playgrounds.component';

describe('FaqPlaygroundsComponent', () => {
  let component: FaqPlaygroundsComponent;
  let fixture: ComponentFixture<FaqPlaygroundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FaqPlaygroundsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqPlaygroundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
