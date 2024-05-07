import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiotCafeComponent } from './riot-cafe.component';

describe('RiotCafeComponent', () => {
  let component: RiotCafeComponent;
  let fixture: ComponentFixture<RiotCafeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RiotCafeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiotCafeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
