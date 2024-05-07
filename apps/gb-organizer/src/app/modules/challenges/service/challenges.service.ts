import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {GlobalService} from "../../../shared/services/global.service";

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {
  private baseUrl = environment.apiUrl
  private communityApiUrl = environment.communityApiUrl
  dublicateChallengeCode: any;
  constructor(private http: HttpClient, private globalService: GlobalService) {
  }
  getChallengesList(page = 1 , status? , gameCode?, startAt?, endDate?) {
    return this.http
      .get(`${this.baseUrl}/admin/challenges/all?page=${page}${status ? `&status=${status}` : ''}${gameCode ?  `&game=${gameCode}` : ''}${startAt ? `&start_at=${startAt}` : ''}${endDate ? `&endDate=${endDate}` : ''}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getChallenge(id) {
    return this.http
      .get(`${this.baseUrl}/admin/challenges/${id}`).pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getChallengesGames() {
    return this.http.get(`${this.baseUrl}/challenges/games`).pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getChallengesGameSettings(gameCode) {
    return this.http
      .get(`${this.baseUrl}/admin/challenges/${gameCode}/settings`).pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getChallengesSettings() {
    return this.http
      .get(`${this.baseUrl}/admin/challenges/additionalSettings`).pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  createChallenges(payload: any) {
    this.globalService.removeEmptyKeys(payload)
    const formData = new FormData();
    if (payload?.banner){
      formData.append('banner', payload.banner);
    }
    formData.append('data' , JSON.stringify(payload))
    return this.http.post(`${this.baseUrl}/admin/challenges/store`, formData).pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  updateChallenge( id , payload: any) {
    const formData = new FormData();
    if (payload?.banner){
      formData.append('banner', payload.banner);
    }
    formData.append('data' , JSON.stringify(payload))
    return this.http.post(`${this.baseUrl}/admin/challenges/${id}`, formData).pipe(
        map((response: any) => {
          return response;
        }),
      );
  }

  deleteChallenge(id) {
    return this.http.delete(`${this.baseUrl}/admin/challenges/${id}`).pipe(map((response: any) => {
          return response;
        }),
      );
  }
}
