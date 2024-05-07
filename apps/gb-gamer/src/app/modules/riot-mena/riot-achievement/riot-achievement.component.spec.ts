import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiotAchievementComponent } from './riot-achievement.component';

describe('RiotAchievementComponent', () => {
  let component: RiotAchievementComponent;
  let fixture: ComponentFixture<RiotAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RiotAchievementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiotAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
