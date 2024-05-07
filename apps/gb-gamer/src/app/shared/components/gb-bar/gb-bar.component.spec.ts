import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GbBarComponent } from './gb-bar.component';

describe('GbBarComponent', () => {
  let component: GbBarComponent;
  let fixture: ComponentFixture<GbBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GbBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GbBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
