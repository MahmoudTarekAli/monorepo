import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaygroundGameComponent } from './playground-game.component';

describe('PlaygroundGameComponent', () => {
  let component: PlaygroundGameComponent;
  let fixture: ComponentFixture<PlaygroundGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlaygroundGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaygroundGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
