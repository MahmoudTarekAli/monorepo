import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkLeagueAccountComponent } from './link-league-account.component';

describe('LinkLeagueAccountComponent', () => {
  let component: LinkLeagueAccountComponent;
  let fixture: ComponentFixture<LinkLeagueAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LinkLeagueAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkLeagueAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
