import {Injectable} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class CustomArenaService {

  private baseUrl = environment.apiUrl
  private communityUrl = environment.communityApiUrl
  arenaSlug: string;
  authority: string;

  constructor(private http: HttpClient) {
  }

  getCustomArena(arena_slug: string): Observable<any> {
    return this.http.get<any>(`${this.communityUrl}/arenas/${arena_slug}`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  getCustomArenaTournaments(arena_slug: string, status: string[], game_code?: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/arenas/${arena_slug}/tournaments?status=${status}${game_code ? `&game_code=${game_code}`: ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getCustomArenaGames(arena_slug: string): Observable<any> {
    return this.http.get<any>(`${this.communityUrl}/arenas/${arena_slug}/tournamentsGames`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }


}
