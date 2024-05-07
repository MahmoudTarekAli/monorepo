import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDoubleEliminationComponent } from './single-double-elimination.component';

describe('SingleEliminationComponent', () => {
  let component: SingleDoubleEliminationComponent;
  let fixture: ComponentFixture<SingleDoubleEliminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleDoubleEliminationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleDoubleEliminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
