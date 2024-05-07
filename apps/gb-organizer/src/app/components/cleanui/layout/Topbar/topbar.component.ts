import {Component, OnInit} from '@angular/core'
import {Select, Store} from '@ngxs/store'
import {SetStateActionNgxs} from "../../../../store/setting_ngxs/actions";
import {Router} from "@angular/router";
import {AuthenticationState} from "../../../../modules/authentication/state/authentication.state";
import {GlobalState} from "../../../../shared/state/global.state";
import {Observable} from "rxjs";
import {User} from "../../../../modules/authentication/models/user";
import {environment} from "../../../../../environments/environment";
import {GetCoins} from "../../../../shared/state/global.action";
import {AuthService} from "../../../../modules/authentication/services/auth.service";
import {GlobalService} from "../../../../shared/services/global.service";

@Component({
  selector: 'cui-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit{
  settings: any = {}
  theme: any
  isMobileView: any
  isMobileMenuOpen: any
  menuViewName = '';

  @Select(AuthenticationState.isAuthenticated) isLoggedIn: Observable<boolean>;

  @Select(AuthenticationState.getAuth) userData: Observable<User>;
  @Select(GlobalState.getCoins) coins$: Observable<number>;
  environment = environment;

  constructor(private store: Store, public router: Router, public authService: AuthService,
              public globalService: GlobalService) {
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting
      this.settings = state
      this.theme = state.theme === 'dark'
      this.isMobileView = state.isMobileView;
      this.isMobileMenuOpen = state.isMobileMenuOpen;

    })
  }
    ngOnInit(): void {
       this.store.dispatch(GetCoins)

    }
  toggleMobileMenu() {
    this.store.dispatch(
      new SetStateActionNgxs({
        isMobileMenuOpen: !this.isMobileMenuOpen,
      }),
    );
  }

  setTheme(nextTheme) {
    this.store.dispatch(
      new SetStateActionNgxs({
        theme: nextTheme,
      }),
    )
  }
  login() {
    // this.cookies.set('source', window.origin + this.router.url, {domain: '.gbarena.com', path: '/',expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1)})
    window.location.href = environment.sso_url + '?source=' + window.origin + this.router.url
  }

  routeSignUp() {
    window.location.href = environment.sso_url + '/signup?source=' + window.origin + this.router.url
  }
  getMonthlyJoinCount() {
    // this.userData.subscribe(data => {
    //   if (data) {
    //     this.store.dispatch(new GetMonthlyJoinCount(data.slug))
    //   }
    // })
  }
  changeMenuViewName(name: string) {
    this.menuViewName = name
  }

  changeLanguage(lang: string) {
    this.globalService.selectedLanguage = lang;
    this.store.dispatch(
      new SetStateActionNgxs({
        locale: lang,
      }),
    )
    this.globalService.updateProfile({language: lang}).subscribe(res => {
    })

  }
}
