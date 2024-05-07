import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectAccountsComponent } from './connect-accounts.component';

describe('ConnectAccountsComponent', () => {
  let component: ConnectAccountsComponent;
  let fixture: ComponentFixture<ConnectAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ConnectAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
