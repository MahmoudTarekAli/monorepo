import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, takeUntil} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';
import {catchError, map} from 'rxjs/operators'
import {LogOut} from '../state/authentication.action'
import {Select, Store} from "@ngxs/store";
import {CookieService} from "ngx-cookie-service";
import {AuthenticationState} from "../state/authentication.state";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;
  private baseUrl: string = environment.apiUrl;
  private authUrl: string = environment.auth_apiUrl;
  private storeUrl: string = environment.storeApiUrl;
  private token: string;
  loadingUser = true;
  userAuth: any;
  isSuperAdmin: boolean;
  isLoggedIn: boolean;
  ctPaymentInfo = new Subject()
  constructor(private http: HttpClient, private store: Store , private router: Router,  private cookieService: CookieService) {
  }


  public getToken(): any {
    return localStorage.getItem('token');
  }

  getAuthUser() {
    return this.http.get(`${this.authUrl}/users/getAuthUser`, {withCredentials: true}).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
  userAdditionalData() {
    return this.http.get(`${this.baseUrl}/users/getAdditionalData`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }


  verifyEmail(body:any) {

    return this.http.post(`${this.authUrl}/verifyEmail` , body,{withCredentials:true}).pipe(
      map((response: any) => {
        return response;
      }));
  }

  VerifySocialUser(code) {
    const body = JSON.stringify({
      social_code: code
    })
    return this.http.post(`${this.authUrl}/auth/getSocialUser`, body,{withCredentials: true}).pipe(
      map((response: any) => {
          return response;
        }));
  }

  postLogout() {

    const body = JSON.stringify({});
    return this.http.post(`${this.authUrl}/logout`, body,{withCredentials: true}).pipe(
      map((response: any) => {
        return response;
      })
      // , catchError((err) => {
      //   return observableThrowError(err);
      // })
    );
  }

  logout() {
    this.store.dispatch(new LogOut(true))
    localStorage.clear();
  }

  checkAuthority() {
    if(!localStorage.getItem('token')){
      window.location.href = environment.sso_url + '?source=' + window.origin + this.router.url
      return;
    }
  }
  public isUserLoggedIn(): any {
    return !!localStorage.getItem('token');
  }
  activateCtPayment(body) {
    return this.http.post(`${this.storeUrl}/thirdParty/ct/activate`, body).pipe(
      map((response: any) => {
        return response;
      }));
  }
}

