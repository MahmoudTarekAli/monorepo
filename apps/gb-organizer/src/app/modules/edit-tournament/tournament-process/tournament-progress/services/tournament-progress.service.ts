import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TournamentProgressService {

  private baseUrl = environment.apiUrl

  constructor(private http: HttpClient) {
  }


  seedParticipants(payload, id) {
    return this.http.post<any>(`${this.baseUrl}/tournaments/${id}/seedjoin`, payload);
  }

  publishTournament(id) {
    return this.http.post<any>(`${this.baseUrl}/tournaments/${id}/publish`, {});
  }

  startTournament(id) {
    return this.http.post<any>(`${this.baseUrl}/tournaments/${id}/startTournament`, {});
  }

  resetTournament(id) {
    return this.http.post<any>(`${this.baseUrl}/tournaments/${id}/reset`, {});
  }

  checkInTournament(id, payload) {
    return this.http.put<any>(`${this.baseUrl}/tournaments/${id}/checkIn`, payload);
  }

  registerTournament(id, payload) {
    return this.http.post<any>(`${this.baseUrl}/tournaments/${id}/registration/${payload}`, {});
  }

  resetSecondStage(id) {
    return this.http.post<any>(`${this.baseUrl}/tournaments/${id}/resetSecondStage`, {});
  }
  deleteTournament(id) {
    return this.http.post<any>(`${this.baseUrl}/tournaments/${id}/delete`, {});
  }
  changeTournamentStatus(id , status) {
    return this.http.put<any>(`${this.baseUrl}/tournaments/${id}/status`, {status});
  }

}

