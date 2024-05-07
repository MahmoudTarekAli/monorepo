import {Action, Selector, State, StateContext, Store} from '@ngxs/store'
import {LogOut, SetUser, UpdateUser, UserCompleted} from './authentication.action'
import {Injectable} from '@angular/core'
import {AuthService} from '../services/auth.service'

import {NzNotificationService} from 'ng-zorro-antd/notification'
import {HandleError, SetNotifications} from '../../../shared/state/global.action'
import {Router} from "@angular/router";
import {User} from "../models/user";
import {TranslateService} from "@ngx-translate/core";
import {GlobalService} from "../../../shared/service/global.service";

declare var Intercom: any;
declare global {
  interface Window {
    intercomSettings: any;
  }
}

export class UserStateModel {
  user: User | null
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    user: null
  },
})

@Injectable()
export class AuthenticationState {

  constructor(private authService: AuthService, private notify: NzNotificationService, private translate: TranslateService,
              private store: Store, private router: Router, private globalService:GlobalService) {
  }

  @Selector()
  static getUser(state: UserStateModel) {
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
        let userData = res
        if (res?.token) {
          localStorage.setItem('token', res?.token)
        }
        this.authService.ctPaymentInfo.subscribe(res => {
          if (res){
            this.activateCt(res)
          }
        })
        if (localStorage.getItem('activationCt') ||  this.authService.ctPaymentInfo){
          const body = localStorage.getItem('activationCt')
          this.activateCt(body)
        }
        // tslint:disable-next-line:no-shadowed-variable
        this.authService.userAdditionalData().subscribe(res => {
          userData = {...userData, ...res}
          localStorage.setItem('User', res?.id)
          localStorage.setItem('username', res?.username)
          localStorage.setItem('premium', res?.is_premium)
          localStorage.setItem('userAuth', JSON.stringify(userData))
          if (userData?.language){
            localStorage.setItem('language', userData?.language.includes('ar') ? 'ar-EG' : 'en-US')
            this.globalService.selectedLanguage = userData?.language.includes('ar') ? 'ar-EG' : 'en-US'
            this.translate.use(userData?.language)
          }
          this.authService.userAuth = userData
          this.authService.isSuperAdmin = userData?.roles.some((role: any) => role?.name === 'SuperAdmin');
          //intercome////
          const username = localStorage.getItem('username');
          const isPremium = localStorage.getItem('is_premium') === 'true';
          // Create the name with or without "-premium" based on premium status
          const fullName = isPremium ? username + ' - premium' : username;
          window.intercomSettings = {
            api_base: "https://api-iam.intercom.io",
            app_id: "d734mc91",
            name: fullName,
            PremiumUser: isPremium
          };
          Intercom('boot', window.intercomSettings);

          const state = getState()
          setState({
            ...state,
            user: userData,
          })
          this.store.dispatch(new UserCompleted())
          this.authService.isLoggedIn = true

        })

      },
      error => {
        console.log(error)
        this.store.dispatch(new UserCompleted())

        if (error.status === 401) {
          this.store.dispatch(new LogOut(false))
          // this.router.navigateByUrl('/login')

        }
        if (error.status === 500) {
          this.store.dispatch(new HandleError(error))
          localStorage.removeItem('role');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('userAuth');
          this.router.navigateByUrl('/')
          sessionStorage.removeItem('source')
        }
        // this.authService.redirectIfNotAuthenticated();
      },
    )
  }

  @Action(UpdateUser)
  updateUser(ctx: StateContext<UserStateModel>, action: UpdateUser) {
    const state = ctx.getState();
    // Update the user object in the store
    const updatedState = {
      ...state,
      user: {...state.user, ...(action.payload)}
    };
    console.log(updatedState)
    ctx.patchState(updatedState);
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
  logOut({getState, setState}: StateContext<UserStateModel>, payload: any) {
    if (payload.payload) {
      this.authService.postLogout().subscribe(res => {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        localStorage.removeItem('userAuth');
        sessionStorage.removeItem('source')
        localStorage.clear();
        this.store.dispatch(new SetNotifications('Success', res.message, 'success'))
        this.router.navigateByUrl('/')
        const state = getState()
        setState({
          ...state,
          user: null
        })
        Intercom('shutdown');
        // Initialize Intercom with new user information

      }, error => {
        this.store.dispatch(new HandleError(error))
      })
    } else {
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userAuth');
      localStorage.removeItem('User');
      sessionStorage.removeItem('source')
    }
  }

activateCt(body){
    if (body){
      this.authService.activateCtPayment(body).subscribe(res => {
        localStorage.removeItem('activationCt')
      },error => {
        localStorage.removeItem('activationCt')
        this.store.dispatch(new HandleError(error))
      });
    }
    }

}




