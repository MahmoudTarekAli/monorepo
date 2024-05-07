import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRiotTableComponent } from './shared-riot-table.component';

describe('SharedRiotTableComponent', () => {
  let component: SharedRiotTableComponent;
  let fixture: ComponentFixture<SharedRiotTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SharedRiotTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedRiotTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
