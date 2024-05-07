import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Tournament} from "../../../shared/models/tournament";
import {map} from "rxjs/operators";
import {User} from "../../authentication/models/user";

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private baseUrl = environment.apiUrl
  private apiUrl_V1 = environment.apiUrl_V1
  private communityUrl = environment.communityApiUrl
  private authApiUrl = environment.auth_apiUrl
  tournamentCode: string;

  constructor(private http: HttpClient) {
  }

  getTournaments(page: number = 1, status?: string, participantsType?: string, gameId?: number): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${this.baseUrl}/tournaments?page=${page}${status ? `&status=${status}` : ''}${participantsType ? `&participants_type=${participantsType}` : ''}${gameId ? `&game_id=${gameId}` : ''}&per_page=12`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getTournament(id: string): Observable<Tournament> {
    return this.http.get<Tournament>(`${this.baseUrl}/tournaments/${id}/returnTournament`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  compareRequiredInputs(id: string): Observable<any> {
    return this.http.get<Tournament>(`${this.baseUrl}/tournaments/${id}/requiredInputs/compare`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  isJoined(id: string): Observable<any> {
    return this.http.get<Tournament>(`${this.baseUrl}/tournaments/${id}/isJoined`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  joinTournament(id: string, payload?: any): Observable<any> {
    return this.http.post<Tournament>(`${this.apiUrl_V1}/tournaments/${id}/join`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  }

  saveTournamentAction(id: string, payload?: any): Observable<any> {
    return this.http.put<Tournament>(`${this.baseUrl}/admin/tournaments/${id}`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  }

  unJoinTournament(id: string, teamId?: any): Observable<any> {
    let params = new HttpParams();
    if (teamId) {
      params = params.set('team_id', teamId);
    }
    return this.http.delete<Tournament>(`${this.apiUrl_V1}/tournaments/${id}/unjoin`, {params}).pipe(
      map((response: any) => {
        return response;
      }));
  }


  getLeaderTeams(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/teams/myTeams?only_leaded=true`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  getTournamentParticipants(id: string, page: number, search: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/tournaments/${id}/returnParticipants/confirmed?page=${page}${search ? `&name=${search}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getTeamAuthority(tournamentCode: string, teamId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/tournaments/${tournamentCode}/teams/${teamId}/authority`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  isArenaFollowed(arenaSlug: string): Observable<any> {
    return this.http.get<any>(`${this.communityUrl}/arenas/${arenaSlug}/following_check`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  checkIn(tournamentId: string, participantOrTeamId?: any): Observable<any> {
    return this.http.put<Tournament>(`${this.baseUrl}/tournaments/${tournamentId}/participants/${participantOrTeamId}/checkIn`, {}).pipe(
      map((response: any) => {
        return response;
      }));
  }

  cancelJoinTeamRequest(requestId: string, participantOrTeamId?: any): Observable<any> {
    return this.http.delete<Tournament>(`${this.baseUrl}/requests/${requestId}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  checkTournamentAuthority(tournamentId: string): Observable<any> {
    return this.http.get<Tournament>(`${this.baseUrl}/tournaments/${tournamentId}/checkAuthority`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getTournamentUnCached(tournamentId: string): Observable<any> {
    return this.http.get<Tournament>(`${this.baseUrl}/tournaments/${tournamentId}/additionalData`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getWinners(tournamentId: string): Observable<any> {
    return this.http.get<Tournament>(`${this.baseUrl}/tournaments/${tournamentId}/returnParticipants/winners`).pipe(
      map((response: any) => {
        return response;
      }));
  }
}
