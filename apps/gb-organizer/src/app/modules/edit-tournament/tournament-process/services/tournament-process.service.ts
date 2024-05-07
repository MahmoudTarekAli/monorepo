import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment'
import {HttpClient} from '@angular/common/http'
import {Tournament} from '../../../tournaments/models/tournament'
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class TournamentProcessService {
  private baseUrl = environment.apiUrl
  private communityApiUrl = environment.communityApiUrl

  constructor(private http: HttpClient) {
  }

  getTournament(id) {
    return this.http.get<Tournament>(`${this.baseUrl}/organizer/tournaments/${id}/returnTournament`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  UpdateTournament(payload, id: number) {
    const formData = new FormData();
    console.log(payload)
    if (payload.profile_picture){
      formData.append('profile_picture', payload.profile_picture);
    }
    if (payload.cover_picture){
      formData.append('cover_picture', payload.cover_picture);
    }
    formData.append('data', JSON.stringify(payload));
    return this.http.post<Tournament>(`${this.baseUrl}/tournaments/${id}`, formData);
  }
  getRequiredInputs(gameId , platformAbbr , type , tournamentCode) {
    return this.http.get<Tournament>(`${this.baseUrl}/requiredInputs?game_id=${gameId}&platform_abbr=${platformAbbr}&type=${type}${tournamentCode ? `&tournament_code=${tournamentCode}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getSuggestedWinners(code){
    return this.http.get<Tournament>(`${this.baseUrl}/tournaments/${code}/winners/suggested`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  finishTournament(code, body){
    return this.http.post<Tournament>(`${this.baseUrl}/tournaments/${code}/FinishTournament`, body)
  }
  highlightParticipant(code, body){
    return this.http.put<Tournament>(`${this.baseUrl}/tournaments/${code}/highlightParticipant`, body)
  }
  getAllowedParticipants(code , name?){
    return this.http.get<Tournament>(`${this.baseUrl}/organizer/tournaments/${code}/returnParticipants/allowed${name ? `?name=${name}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  removeEmptyKeys(value){
    Object.keys(value).forEach(key => {
      if (value[key] === '' || value[key] === undefined) {
        delete value[key];
      }
    });
  }
}
