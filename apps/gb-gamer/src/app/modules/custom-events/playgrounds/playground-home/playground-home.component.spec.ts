import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaygroundHomeComponent } from './playground-home.component';

describe('PlaygroundHomeComponent', () => {
  let component: PlaygroundHomeComponent;
  let fixture: ComponentFixture<PlaygroundHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlaygroundHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaygroundHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
