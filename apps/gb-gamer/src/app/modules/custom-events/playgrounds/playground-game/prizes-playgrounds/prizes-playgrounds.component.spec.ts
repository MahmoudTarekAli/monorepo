import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizesPlaygroundsComponent } from './prizes-playgrounds.component';

describe('PrizesPlaygroundsComponent', () => {
  let component: PrizesPlaygroundsComponent;
  let fixture: ComponentFixture<PrizesPlaygroundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PrizesPlaygroundsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizesPlaygroundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
