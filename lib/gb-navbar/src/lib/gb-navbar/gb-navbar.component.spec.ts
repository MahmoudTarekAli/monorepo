import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GbNavbarComponent } from './gb-navbar.component';

describe('GbNavbarComponent', () => {
  let component: GbNavbarComponent;
  let fixture: ComponentFixture<GbNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GbNavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GbNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
