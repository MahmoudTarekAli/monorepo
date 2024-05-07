import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishTopbarComponent } from './publish-topbar.component';

describe('PublishTopbarComponent', () => {
  let component: PublishTopbarComponent;
  let fixture: ComponentFixture<PublishTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishTopbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
