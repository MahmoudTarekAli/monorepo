import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Select, Store} from '@ngxs/store'
import {AuthenticationState} from '../../../../../modules/authentication/state/authentication.state'
import {Observable} from 'rxjs'
import {AuthService} from '../../../../../modules/authentication/services/auth.service'
import {LogOut} from '../../../../../modules/authentication/state/authentication.action'
import {SetStateActionNgxs} from "../../../../../store/setting_ngxs/actions";
import {Clipboard} from "@angular/cdk/clipboard";

@Component({
  selector: 'cui-topbar-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class TopbarUserMenuComponent {
  name: string;
  role: string;
  email: string;
  phone: string;
  popOverProfileVisible = false;
  isShowLanguage = false;
  // tslint:disable-next-line:variable-name
  profile_image: string;
  user = JSON.parse(localStorage.getItem('userData'));
  @Select(AuthenticationState.getAuth) userData: Observable<{}>;
  @Select(AuthenticationState.isAuthenticated) isLoggedIn: Observable<{}>;
  language
  constructor(private router: Router, public authService: AuthService, private store: Store , private clipboard: Clipboard) {
    this.isLoggedIn.subscribe(res => {
      // console.log(res)
    })
    this.role = localStorage.getItem('role');
    this.store
      .select(state => state.setting)
      .subscribe(state => {
        this.language = state.setting.locale
      });
  }
  changeLanguage(lang: any) {
    console.log(lang)
    this.store.dispatch(
      new SetStateActionNgxs({
        locale: lang,
      }),
    )

  }
  onCopyCode(code) {
    this.clipboard.copy(code)
  }
}
