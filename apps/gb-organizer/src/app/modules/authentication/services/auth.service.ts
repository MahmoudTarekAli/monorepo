import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';
import { catchError, map } from 'rxjs/operators'
import { Tournament } from '../../tournaments/models/tournament'
import { LogOut } from '../state/authentication.action'
import { Store } from '@ngxs/store'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user;
  private baseUrl: string = environment.apiUrl;
  private authUrl: string = environment.auth_apiUrl;
  isLoggedIn: boolean;
  private token: string;
  public tokenSubjectSource = new BehaviorSubject<string>('');
  userAuth;
  isAutheiticated = false;
  constructor(private http: HttpClient, private router: Router , private store: Store) {
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }


  login($userCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/local/login`, $userCredentials, {
      observe: 'response',
        withCredentials: true
    });
  }


  public saveUserData(data) {
    localStorage.setItem('userData', JSON.stringify(data));
  }

  getAuthUser() {
    return this.http.get(`${this.authUrl}/users/getAuthUser` , {withCredentials: true}).pipe(
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
  changeCustomUpdate(payload){
    return this.http.put<any>(`${this.authUrl}/users/customUpdate`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  }
  postLogout() {
    const body = JSON.stringify({});
    return this.http.post(`${this.authUrl}/logout`, body, {
      withCredentials: true
    }).pipe(
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

}
