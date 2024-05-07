import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Tournament} from "../../../shared/models/tournament";
import {map} from "rxjs/operators";
import {Challenge, ChallengeList} from "../../../shared/models/challenge";
import {Game} from "../../../shared/models/game";
import {Observable} from "rxjs";
import {Arena} from "../../../shared/models/arena";
import {User} from "../../authentication/models/user";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private baseUrl = environment.apiUrl
  private supportApiUrl = environment.supportApiUrl
  private storeUrl = environment.storeApiUrl

  constructor(private http: HttpClient) {
  }

  getTournaments(page: number = 1 , status?:string , per_page?:number , collection?:string): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${this.baseUrl}/tournaments?page=${page}${status ? `&status=${status}` : ''}${per_page ? `&per_page=${per_page}` : ''}${collection ? `&collection=${collection}` : ''}`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  getBanners(): Observable<any[]> {
    return this.http.get<any[]>(`${this.supportApiUrl}/banners/featured?featuring_page=homepage`).pipe(
      map((response: any) => {
        return response.filter((banner: any) => banner.backgrounds !== null);
      }));
  }

  getChallenges(page: number = 1 , per_page?: number , status?:string[] , game?:string): Observable<ChallengeList> {

    return this.http.get<ChallengeList>(`${this.baseUrl}/challenges?page=${page}${per_page ? `&per_page=${per_page}` : ''}${status ? `&status=${status}` : ''}${game ? `&game=${game}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getTrendingGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.baseUrl}/games/trendingGames`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
  getPremiumPlayables(isPremium): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/playables?is_premium=${isPremium}`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
  getStoreProdcucts(): Observable<any[]> {
    return this.http.get<any>(`${this.storeUrl}/products/top`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  // getFriends(): Observable<User[]> {
  //   return this.http.get<User[]>(`${this.communityUrl}/friendship/friends`).pipe(
  //     map((response: any) => {
  //       return response.data;
  //     }));
  // }


}
