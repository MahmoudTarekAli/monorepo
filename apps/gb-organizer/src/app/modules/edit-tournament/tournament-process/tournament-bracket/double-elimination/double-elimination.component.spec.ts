import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleEliminationComponent } from './double-elimination.component';

describe('DoubleEliminationComponent', () => {
  let component: DoubleEliminationComponent;
  let fixture: ComponentFixture<DoubleEliminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoubleEliminationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubleEliminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
