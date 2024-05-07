import {State, Action, StateContext, Selector, Store} from '@ngxs/store'
import {SetUser, LogOut, UserCompleted} from './authentication.action'
import {tap} from 'rxjs/operators'
import {Injectable} from '@angular/core'
import {AuthService} from '../services/auth.service'

import {NzNotificationModule, NzNotificationService} from 'ng-zorro-antd/notification'
import { HandleError } from '../../../shared/state/global.action'
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {GlobalService} from "../../../shared/services/global.service";

export class UserStateModel {
  user: any
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    user: {},
  },
})

@Injectable()
export class AuthenticationState {
  userData: any = null;
  constructor(private authService: AuthService, private notify: NzNotificationService, private store: Store,
              private router: Router, private translate: TranslateService, private globalService: GlobalService) {
  }
  @Selector()
  static getAuth(state: UserStateModel) {
    return state.user
  }

  @Selector()
  static token(state: UserStateModel): string | null {
    return localStorage.getItem('token');
  }

  @Selector()
  static isAuthenticated(state: UserStateModel): boolean {
    return !!localStorage.getItem('token');
  }

  @Action(SetUser)
  SetUser({getState, setState}: StateContext<UserStateModel>) {
      return this.authService.getAuthUser().subscribe(res => {
          this.userData = res
          if (res?.token) {
            localStorage.setItem('token', res?.token)
          }
          // tslint:disable-next-line:no-shadowed-variable
          this.authService.userAdditionalData().subscribe(res => {
            localStorage.setItem('User', res?.id)
            localStorage.setItem('userAuth', JSON.stringify(res))
            this.userData = {...this.userData, ...res}
            localStorage.setItem('language', this.userData?.language)
            this.globalService.selectedLanguage = this.userData?.language
            this.translate.use(this.userData?.language)

            const state = getState()
            setState({
              ...state,
              user: this.userData,
            })
            this.store.dispatch(new UserCompleted())
            this.authService.isLoggedIn = true

          })

        },
        error => {
          console.log(error)
          if (error.status === 401) {
            this.store.dispatch(new LogOut(false))
            // this.router.navigateByUrl('/login')

          }
          if (error.status === 500){
            this.store.dispatch(new HandleError(error))
            localStorage.removeItem('role');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userAuth');
            this.router.navigateByUrl('/login')

          }
          // this.authService.redirectIfNotAuthenticated();
        },
      )

  }

  //
  // @Action(SetUser)
  // setAppConfig({ getState, patchState }: StateContext<UserStateModel>, { payload }: SetUser) {
  //   const state = getState();
  //   console.log(payload)
  //   return patchState({
  //     user: { ...state.user, payload },
  //   });
  // }
  @Action(LogOut)
  logOut({getState, setState}: StateContext<UserStateModel>, payload) {
    console.log(payload.payload)
    if (payload.payload) {
      this.authService.postLogout().subscribe(res => {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        localStorage.removeItem('userAuth');
        localStorage.clear();
        this.notify.blank('Success', res.message)
        const state = getState()
        setState({
          ...state,
          user: {},
        })
        this.router.navigateByUrl('/login')
      }, error => {
        console.log(error)
        this.store.dispatch(new HandleError(error))
      })
    } else {
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userAuth');
      this.router.navigateByUrl('/login')

    }
  }



}




