import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyIntergrationsComponent } from './third-party-intergrations.component';

describe('ThirdPartyIntergrationsComponent', () => {
  let component: ThirdPartyIntergrationsComponent;
  let fixture: ComponentFixture<ThirdPartyIntergrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ThirdPartyIntergrationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdPartyIntergrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
