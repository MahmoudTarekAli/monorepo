import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";
import {Subject} from "rxjs";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MatchListService {
  private baseUrl = environment.apiUrl
  private chatApiUrl = environment.chatApiUrl
  changedParticipants = new Subject()
  isMatchParticipant = false
  constructor(private http: HttpClient, private router: Router) {
  }

  getTree(id, stage) {
    return this.http.get<any>(`${this.baseUrl}/tournaments/${id}/returnTree/${stage}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  updateStatus(id, status) {
    return this.http.post<any>(`${this.baseUrl}/matches/${id}/setStatus`, status).pipe(
      map((response: any) => {
        return response;
      }));
  }

  setScore(id, status) {
    return this.http.post<any>(`${this.baseUrl}/matches/${id}/setScore`, status).pipe(
      map((response: any) => {
        return response;
      }));
  }

  updateRoundOrGroupMatchesStatus(tournamentId, treeId, status) {
    return this.http.put<any>(`${this.baseUrl}/tournaments/${tournamentId}/trees/${treeId}/changeMatchesStatus`, status).pipe(
      map((response: any) => {
        return response;
      }));
  }

  setRoundOrGroupMatchesDate(tournamentId, payload) {
    return this.http.post<any>(`${this.baseUrl}/tournaments/${tournamentId}/scheduleMatches`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  }

  replacePlayer(matchCode, payload) {
    return this.http.post<any>(`${this.baseUrl}/matches/${matchCode}/addParticipant`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  }

  resetMatches(tournamentCode, payload) {
    return this.http.post<any>(`${this.baseUrl}/tournaments/${tournamentCode}/resetScores`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getTournamentParticipants(id) {
    return this.http.get<any>(`${this.baseUrl}/tournaments/${id}/returnParticipants`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  getTournamentMatches(id) {
    return this.http.get<any>(`${this.baseUrl}/trees/${id}/matches`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getMatch(matchCode) {
    return this.http.get<any>(`${this.baseUrl}/matches/${matchCode}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getTournamentTeamMember(tournamentCode, teamId) {
    return this.http.get<any>(`${this.baseUrl}/tournaments/${tournamentCode}/teams/${teamId}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  reportIssue(matchCode, payload) {
    return this.http.put<any>(`${this.chatApiUrl}/${matchCode}/reportIssue`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  }

  resolveIssue(matchCode) {
    return this.http.put<any>(`${this.chatApiUrl}/${matchCode}/resolveIssue`, {}).pipe(
      map((response: any) => {
        return response;
      }));
  }

  reportScreenShots(matchCode, payload) {
    return this.http.post<any>(`${this.chatApiUrl}/matches/${matchCode}/report/screenshots`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  }


}

