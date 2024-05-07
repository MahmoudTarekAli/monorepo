import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchoSystemComponent } from './echo-system.component';

describe('EchoSystemComponent', () => {
  let component: EchoSystemComponent;
  let fixture: ComponentFixture<EchoSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EchoSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EchoSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
