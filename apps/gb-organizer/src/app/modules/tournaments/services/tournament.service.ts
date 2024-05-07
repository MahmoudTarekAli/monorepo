import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Tournament} from "../models/tournament";
import {map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  private baseUrl = environment.apiUrl
  private communityApiUrl = environment.communityApiUrl

  constructor(private http: HttpClient) {
  }


  getTournaments(page? , name?, status?  , ParticipantsType? , arenaId? , gameCode? , startAt? , creationAt?){
    return this.http.get<Tournament[]>(`${this.baseUrl}/users/tournaments/managed?page=${page ? page : 1}${name ? `&name=${name}` : ''}${status ? `&status=${status}` : ''}${ ParticipantsType ? `&participants_type=${ParticipantsType}` : ''}${arenaId ? `&arena_id=${arenaId}` : ''}${gameCode ? `&game_code=${gameCode}` : ''}${startAt ? `&start_at=${startAt}` : ''}${creationAt ? `&created_at=${creationAt}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  // getManagedTournaments(page? , name? , status?  , isPublished? , arenaId? , gameId? )  {
  //   return this.http.get<Tournament[]>(`${this.baseUrl}/tournaments/organizerManagedTournaments?page=${page}${name ? `&name=${name}` : ''}${status ? `&status=${status}` : ''}${isPublished ? `&is_published=${isPublished}` : ''}${arenaId ? `&arena_id=${arenaId}` : ''}${gameId ? `&game_id=${gameId}` : ''}`).pipe(
  //     map((response: any) => {
  //       return response;
  //     }));
  // }

  getTournament(id) {
    return this.http.get<Tournament>(`${this.baseUrl}/organizer/tournaments/${id}/returnTournament`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  getGames(isMostUsed?) {
    return this.http.get<any>(`${this.baseUrl}/games${isMostUsed ? `?is_most_used=${isMostUsed}` : ''}`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
  getLeagueSettings(gameCode: string) {
    return this.http.get<any>(`${this.baseUrl}/games/${gameCode}/tournamentSettings`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getArenas() {
    return this.http.get<any>(`${this.communityApiUrl}/arenas/organizer/myArenas`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }


  addTournament(payload: Tournament) {
    return this.http.post<Tournament>(`${this.baseUrl}/tournaments`, payload);
  }

  seedParticipants(payload, id) {
    return this.http.post<Tournament>(`${this.baseUrl}/tournaments/${id}/seedjoin`, payload);
  }

  publishTournament(id) {
    return this.http.post<Tournament>(`${this.baseUrl}/tournaments/${id}/publish`, {});
  }

}

