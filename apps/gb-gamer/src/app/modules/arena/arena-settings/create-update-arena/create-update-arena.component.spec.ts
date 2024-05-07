import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateArenaComponent } from './create-update-arena.component';

describe('CreateUpdateArenaComponent', () => {
  let component: CreateUpdateArenaComponent;
  let fixture: ComponentFixture<CreateUpdateArenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CreateUpdateArenaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpdateArenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
