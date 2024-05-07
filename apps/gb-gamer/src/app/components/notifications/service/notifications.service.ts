import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private baseUrl = environment.apiUrl
  private notificationUrl = environment.notificationsApiUrl
  language:string;
  constructor(private http: HttpClient) {}

  getNotifications(page:number = 1): Observable<any> {
    return this.http.get<any>(`${this.notificationUrl}/notifications/all?page=${page}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getUnreadRequestsCount(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/requests/count`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getCountUnreadNotifications(): Observable<any> {
    return this.http.get<any>(`${this.notificationUrl}/notifications/countUnread`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  readNotification(notification_id:number): Observable<any> {
    return this.http.put<any>(`${this.notificationUrl}/notifications/read/${notification_id}` , {}).pipe(
      map((response: any) => {
        return response;
      }));
  }
  readAllNotification(): Observable<any> {
    return this.http.put<any>(`${this.notificationUrl}/notifications/readAll` , {}).pipe(
      map((response: any) => {
        return response;
      }));
  }

}
