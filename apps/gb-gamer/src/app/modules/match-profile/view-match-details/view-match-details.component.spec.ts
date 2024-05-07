import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMatchDetailsComponent } from './view-match-details.component';

describe('ViewMatchTeamsComponent', () => {
  let component: ViewMatchDetailsComponent;
  let fixture: ComponentFixture<ViewMatchDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ViewMatchDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMatchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
