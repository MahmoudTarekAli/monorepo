import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiotRamadanHomeComponent } from './riot-ramadan-home.component';

describe('RiotRamadanHomeComponent', () => {
  let component: RiotRamadanHomeComponent;
  let fixture: ComponentFixture<RiotRamadanHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RiotRamadanHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiotRamadanHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
