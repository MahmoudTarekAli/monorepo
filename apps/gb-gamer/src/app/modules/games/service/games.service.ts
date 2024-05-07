import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Game} from "../../../shared/models/game";
import {Tournament, TournamentList} from "../../../shared/models/tournament";

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  private baseUrl = environment.apiUrl
  private communityUrl = environment.communityApiUrl

  constructor(private http: HttpClient) {
  }
  getAllGames(): Observable<Game[]> {
    return this.http.get<Game>(`${this.baseUrl}/games`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
  getTrendingGames(): Observable<Game[]> {
    return this.http.get<Game>(`${this.baseUrl}/games/trendingGames`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
  getGame(code:string): Observable<Game> {
    return this.http.get<Game>(`${this.baseUrl}/games/${code}`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
  getGameTournaments(code:string , status? , page?:number): Observable<TournamentList> {
    return this.http.get<Tournament>(`${this.baseUrl}/games/${code}/tournaments?page=${page}&per_page=12${status ? `&status=${status}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));

  }
  getGamesGenres(): Observable<[]> {
    return this.http.get<[]>(`${this.baseUrl}/genres`).pipe(
      map((response: any) => {
        return response;
      }));

  }
  followGame(gameCode:string): Observable<[]> {
    const body = { game_code: gameCode };
    return this.http.post<[]>(`${this.baseUrl}/preferences` , body).pipe(
      map((response: any) => {
        return response;
      }));

  }
  unFollowGame(gameCode:string): Observable<[]> {
    return this.http.delete<[]>(`${this.baseUrl}/preferences?game_code=${gameCode}`).pipe(
      map((response: any) => {
        return response;
      }));

  }
}
