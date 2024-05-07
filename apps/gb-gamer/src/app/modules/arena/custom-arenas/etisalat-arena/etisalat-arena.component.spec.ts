import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtisalatArenaComponent } from './etisalat-arena.component';

describe('EtisalatArenaComponent', () => {
  let component: EtisalatArenaComponent;
  let fixture: ComponentFixture<EtisalatArenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtisalatArenaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtisalatArenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
