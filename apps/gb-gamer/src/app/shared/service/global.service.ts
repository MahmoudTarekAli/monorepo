import {EventEmitter, Injectable, Output} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Game} from "../models/game";
import {map} from "rxjs/operators";
import {Leaderboard, LeaderboardPoints} from "../models/leaderboard";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {ViewRulesComponent} from "../../modules/challenges/modal/view-rules/view-rules.component";
import {SocialErrorModalComponent} from "../../components/social-error-modal/social-error-modal.component";
import {en_US} from "ng-zorro-antd/i18n";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public imageSelected = new Subject<any>();
  public matchScore$ = new BehaviorSubject<any>('');

  private baseUrl = environment.apiUrl
  private communityUrl = environment.communityApiUrl
  private storeUrl = environment.storeApiUrl
  private notificationUrl = environment.notificationsApiUrl
  private chatUrl = environment.chatApiUrl
  selectedLanguage:string = 'en-US';
  selectedGame = ''
  clientTimezoneOffset
  constructor(private http: HttpClient, private nzNotificationService:NzNotificationService, private modalService:NzModalService) {
    this.clientTimezoneOffset = new Date().getTimezoneOffset() / 60;
    if (this.clientTimezoneOffset > 0) {
      this.clientTimezoneOffset = this.clientTimezoneOffset * -1
    } else {
      this.clientTimezoneOffset = '+' + this.clientTimezoneOffset * -1
    }
  }

  getLeaderboards(type:string , id:string): Observable<Leaderboard> {
    return this.http.get<any>(`${this.baseUrl}/${type}/${id}/leaderboards`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getLeaderBoardPoints(id: number , page?:number): Observable<LeaderboardPoints> {
    return this.http.get<any>(`${this.baseUrl}/leaderboards/${id}/points?page=${page}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getPublisherAccounts(slug: string | null , id:number , tournamentCode , challengeId): Observable<any> {
    let queryParams = '';
    if (id) {
      queryParams += `?id=${id}`;
    }
    if (tournamentCode) {
      queryParams += `${queryParams ? '&' : '?'}tournament_code=${tournamentCode}`;
    }
    if (challengeId) {
      queryParams += `${queryParams ? '&' : '?'}challenge_id=${challengeId}`;
    }
    return this.http.get<any>(`${this.baseUrl}/users/${slug}/publisherAccounts${queryParams}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getCoins(): Observable<any> {
    return this.http.get<any>(`${this.storeUrl}/coins`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getFriends(): Observable<any> {
    return this.http.get<any>(`${this.communityUrl}/friendship/friends?per_page=40`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getRequests( id: string , direction:string, tournamentCode?:string): Observable<any> {
    let queryParams = '';
    if (direction) {
      queryParams += `?direction=${direction}`;
    }
    if (tournamentCode) {
      queryParams += `${queryParams ? '&' : '?'}tournament=${tournamentCode}`;
    }
    return this.http.get<any>(`${this.baseUrl}/teams/${id}/requests${queryParams}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  postRequest(payload:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/requests`,payload).pipe(
      map((response: any) => {
        return response;
      }));
  }
  updateRequest(requestId:string , requiredInputs?:any , required_accounts?): Observable<any> {
    let body:any = {};

    if(requiredInputs ){
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
  cancelRequest(requestId:string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/requests/${requestId}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getSearchUsers(text:string) {
    return this.http.get(`${this.baseUrl}/users/search?text=${text}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getNotifications(page:number = 1): Observable<any> {
    return this.http.get<any>(`${this.notificationUrl}/notifications/all?page=${page}`).pipe(
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
  setResponsiveImage(imageUrl:any) {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1024) {
      return imageUrl = imageUrl.l;
    } else if (screenWidth >= 768) {
     return  imageUrl = imageUrl.m;
    } else {
      return imageUrl = imageUrl.s;
    }


  }
  getMonthlyJoinCount(slug:string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/gamers/${slug}/monthlyJoinsCount`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getUsersByIds(users: number[]): Promise<any> {
    return this.http.post(`${this.baseUrl}/users`, {ids: users})
      .pipe(
        map((response: any) => response.data)
      )
      .toPromise();
  }
  postClaimScore(code, type, score_home, score_away, side, screenshot, note?) {
    const formData = new FormData();
    if (screenshot){
      formData.append('screenshot', screenshot);

    }
    let body = JSON.stringify({
      score_home: score_home,
      score_away: score_away,
      side: side,
      note: note,
    });
    formData.append('data', body);

    return this.http.post(`${this.baseUrl}/matches/${code}/claim/${type}`, formData).pipe(
      map((response: any) => {
        return response;
      }),
    );
  }
  getSocialLoginError() {
    if (sessionStorage.getItem('social_login_error')){
      this.modalService.create({
        nzContent: SocialErrorModalComponent,
        nzTitle: 'Connect Account',
        nzFooter: null,
        nzCentered: true,
        nzWidth: '600px',
        nzClassName:'challenge-modal',
        nzData: {error: sessionStorage.getItem('social_login_error').replace(/_/g, ' ')},
      })
      // sessionStorage.removeItem('social_login_error')
    }
  }
  removeUserImage(type) {
    let payload = {type: type};
    return this.http.put(`${this.baseUrl}/users/removePicture` , payload).pipe(
      map((response: any) => {
        return response;
      }))
  }
  removeEmptyKeys(body) {
    Object.keys(body).forEach(key => {
      if (body[key] === '' || body[key] === null || body[key]?.length === 0) {
        delete body[key];
      }
    });
  }
}
