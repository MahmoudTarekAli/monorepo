import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditChallengeComponent } from './create-edit-challenge.component';

describe('CreateEditChallengeComponent', () => {
  let component: CreateEditChallengeComponent;
  let fixture: ComponentFixture<CreateEditChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CreateEditChallengeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
