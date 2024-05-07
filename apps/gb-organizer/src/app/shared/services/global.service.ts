import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public matchScore$ = new BehaviorSubject<any>('');
  private storeUrl = environment.storeApiUrl
  private baseUrl = environment.apiUrl
  private authUrl = environment.auth_apiUrl
  selectedLanguage = 'en-US';
  clientTimezoneOffset: any;
  constructor(private http: HttpClient) {
    this.clientTimezoneOffset = new Date().getTimezoneOffset() / 60;
    if (this.clientTimezoneOffset > 0) {
      this.clientTimezoneOffset = this.clientTimezoneOffset * -1
    } else {
      this.clientTimezoneOffset = '+' + this.clientTimezoneOffset * -1
    }

  }
  getCoins(): Observable<any> {
    return this.http.get<any>(`${this.storeUrl}/coins`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getMonthlyJoinCount(slug: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/gamers/${slug}/monthlyJoinsCount`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  removeEmptyKeys(body){
    Object.keys(body).forEach(key => {
      if (body[key] === '' || body[key] === null || body[key]?.length === 0) {
        delete body[key];
      }
    });
  }
  updateRequest(requestId: string , requiredInputs?: any , required_accounts?): Observable<any> {
    let body: any = {};

    if (requiredInputs ){
      body = {additional_data: {
          userSupportedRequiredInputsKey: requiredInputs ,
        }};
    }
    if (required_accounts){
      body.additional_data = {...body.additional_data , required_accounts: [required_accounts]}
    }
    if (body?.additional_data){
      this.removeEmptyKeys(body?.additional_data);

    }
    return this.http.put<any>(`${this.baseUrl}/requests/${requestId}` , body ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  cancelRequest(requestId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/requests/${requestId}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getSpecificRequest(type:string , page:number = 1): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/requests/${type}?page=${page}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  updateProfile(profile) {
    const body = JSON.stringify(profile);
    const formData = new FormData();
    formData.append('data', body);
    return this.http
      .post(`${this.authUrl}/users/updateProfile`, formData)
      .pipe(map((response: any) => {
          return response;
        })
      );
  }
}
