import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Game} from "../../../shared/models/game";
import {Tournament, TournamentList} from "../../../shared/models/tournament";
import {Arena} from "../../../shared/models/arena";
import {ChallengeList} from "../../../shared/models/challenge";

@Injectable({
  providedIn: 'root'
})
export class ArenaService {

  private baseUrl = environment.apiUrl
  private communityUrl = environment.communityApiUrl
  arenaSlug:string;
  authority:string;
  constructor(private http: HttpClient) {
  }

  createArena( body:any ) {
    return this.http.post(`${this.communityUrl}/arenas`, body)
      .pipe(
        map((response: any) => {
          return response;
        }),
      );
  }
  updateArena(code:string ,  body:any ) {
    return this.http.post(`${this.communityUrl}/arenas/${code}`, body)
      .pipe(
        map((response: any) => {
          return response;
        }),
      );
  }
  getAllArenas(page:number , search?:string): Observable<Arena[]> {
    return this.http.get<Arena[]>(`${this.communityUrl}/arenas?page=${page}${search ? `&name=${search}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getArena(code:string): Observable<Arena> {
    return this.http.get<Arena>(`${this.communityUrl}/arenas/${code}`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
  getArenaEvents(code:string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/arenas/${code}/events`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
  getFeaturedArenas(): Observable<Arena[]> {
    return this.http.get<Arena[]>(`${this.communityUrl}/arenas/featuredArenas`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
  getArenaChallenges(arena:string , page: number = 1 , per_page?: number , status?:string[] ): Observable<ChallengeList> {
    return this.http.get<ChallengeList>(`${this.baseUrl}/arenas/${arena}/challenges?page=${page}${per_page ? `&per_page=${per_page}` : ''}${status ? `&status=${status}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  followUnfollowArena(arenaCode:string , type:string): Observable<any> {
    return this.http.put<any>(`${this.communityUrl}/arenas/${arenaCode}/${type}` , {}).pipe(
      map((response: any) => {
        return response;
      }));

  }
  getArenaTournaments(code:string, page?:number , status?:any ): Observable<Tournament[]> {
    return this.http.get<Tournament>(`${this.baseUrl}/arenas/${code}/tournaments?page=${page}&per_page=12${status ? `&status=${status}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));

  }
  getArenaAuthority(code:string ): Observable<any> {
    return this.http.get<any>(`${this.communityUrl}/arenas/${code}/checkAuthority`).pipe(
      map((response: any) => {
        return response;
      }));

  }
  getArenaControllers(code:string ): Observable<any> {
    return this.http.get<any>(`${this.communityUrl}/arenas/${code}/controllers`).pipe(
      map((response: any) => {
        return response;
      }));

  }
  assignRole(code:string ,body:any , type:string): Observable<any> {
    return this.http.post<any>(`${this.communityUrl}/arenas/${code}/${type}`,body).pipe(
      map((response: any) => {
        return response;
      }));

  }
  manageArenasActions(slug:string ,body:any): Observable<any> {
    return this.http.put<any>(`${this.communityUrl}/admin/arenas/${slug}`,body).pipe(
      map((response: any) => {
        return response;
      }));

  }

}
