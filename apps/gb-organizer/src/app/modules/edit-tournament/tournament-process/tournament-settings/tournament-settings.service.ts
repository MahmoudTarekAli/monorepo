import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators'
import {environment} from '../../../../../environments/environment'
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class TournamentSettingsService {
  private baseUrl = environment.apiUrl
  private communityApiUrl = environment.communityApiUrl

  constructor(private http: HttpClient) {
  }

  getSearchUsers(text) {
    return this.http.get(`${this.baseUrl}/users/search?text=${text}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getArenas(text) {
    return this.http.get(`${this.communityApiUrl}/arenas/getAllArenas?name=${text}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getEvents() {
    return this.http.get(`${this.baseUrl}/events/myEvents`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  getThirdParty() {
    return this.http.get(`${this.baseUrl}/thirdPartyServices`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  addModerator(payload, code) {
    return this.http.post(`${this.baseUrl}/tournaments/${code}/moderators/addModerator`, payload)
  }

  addSponsor(payload) {
    return this.http.post(`${this.baseUrl}/requests/request`, payload)
  }


  addTournamentEvent(payload, eventCode) {
    return this.http.put(`${this.baseUrl}/events/${eventCode}/tournaments`, payload)
  }
  removeEventTournament(tournamentCode , eventCode ) {
    return this.http.delete(`${this.baseUrl}/events/${eventCode}/tournaments/${tournamentCode}`, {})
  }

  deleteModerator(userId, code) {
    return this.http.delete(`${this.baseUrl}/tournaments/${code}/moderators/${userId}`)
  }
  getSponsors(code){
    return this.http.get(`${this.baseUrl}/tournaments/${code}/sponsors`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  deleteSponsor(slug, code) {
    return this.http.delete(`${this.baseUrl}/tournaments/${code}/sponsors/${slug}`)
  }
  duplicateTournament(code , body) {
    return this.http.post(`${this.baseUrl}/tournaments/${code}/copyTournament`, body)
  }
}
