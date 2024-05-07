import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiotHomeComponent } from './riot-home.component';

describe('RiotHomeComponent', () => {
  let component: RiotHomeComponent;
  let fixture: ComponentFixture<RiotHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RiotHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiotHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
