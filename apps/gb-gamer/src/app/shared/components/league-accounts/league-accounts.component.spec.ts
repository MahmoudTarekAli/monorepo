import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueAccountsComponent } from './league-accounts.component';

describe('LeagueAccountsComponent', () => {
  let component: LeagueAccountsComponent;
  let fixture: ComponentFixture<LeagueAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LeagueAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeagueAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
