import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTeamComponent } from './create-update-team.component';

describe('CreateUpdateTeamComponent', () => {
  let component: CreateUpdateTeamComponent;
  let fixture: ComponentFixture<CreateUpdateTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CreateUpdateTeamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpdateTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
