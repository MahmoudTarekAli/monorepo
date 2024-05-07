import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Tournament} from "../../../shared/models/tournament";
import {Challenge, ChallengeList} from "../../../shared/models/challenge";

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {

  private baseUrl = environment.apiUrl
  private communityUrl = environment.communityApiUrl

  constructor(private http: HttpClient) {
  }
  getChallengeList(page?:number , status?:string[] , game?:string): Observable<ChallengeList> {
    return this.http.get<Challenge>(`${this.baseUrl}/challenges?page=${page}${status ? `&status=${status}` : ''}${game ? `&game=${game}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getChallenge(code:string): Observable<Challenge> {
    return this.http.get<Challenge>(`${this.baseUrl}/challenges/${code}`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
  getChallengeParticipants(code:string , page?:number): Observable<Challenge> {
    return this.http.get<Challenge>(`${this.baseUrl}/challenges/${code}/participants?page=${page}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getIsJoined(id:string ): Observable<any> {
    return this.http.get<Challenge>(`${this.baseUrl}/challenges/${id}/isJoined`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  claimScore(id:string , password?:string ): Observable<any> {
    return this.http.get<Challenge>(`${this.baseUrl}/challenges/${id}/score/update${password ? `?password=${password}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  joinChallenge(id:string , body:any ) {
    return this.http.post(`${this.baseUrl}/challenges/${id}/join`, body)
      .pipe(
        map((response: any) => {
          return response;
        }),
      );
  }
  getChallengesGame(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/challenges/games`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  claimAdminScore(id:string , body:any) {
    return this.http.put(`${this.baseUrl}/admin/challenges/${id}/claimScore` , body).pipe(
        map((response: any) => {
          return response;
        }));
  }
  updateRestriction(id:string, payload:any) {
    return this.http.put(`${this.baseUrl}/admin/challenges/${id}/restrictions/IP` , payload).pipe(
        map((response: any) => {
          return response;
        }));
  }
 getMyIp(){
   return this.http.get(`${this.baseUrl}/admin/challenges/myIP`).pipe(
     map((response: any) => {
       return response;
     }));
 }
}
