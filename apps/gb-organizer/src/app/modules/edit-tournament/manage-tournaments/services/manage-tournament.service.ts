import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment'
import {HttpClient} from '@angular/common/http'
import {Tournament} from '../../../tournaments/models/tournament'
import {map} from 'rxjs/operators'
import {Router} from '@angular/router'
import {BRACKET_TYPES} from "../../../../core/tournament.enum";
import {AngularFireFunctions} from "@angular/fire/compat/functions";

@Injectable({
  providedIn: 'root'
})
export class ManageTournamentService {
  private baseUrl = environment.apiUrl
  private communityApiUrl = environment.communityApiUrl
  isFullScreen = false

  constructor(private http: HttpClient, private router: Router , private fns: AngularFireFunctions) {
  }

  getTournamentLogs(id, page?) {
    return this.http.get<Tournament>(`${this.baseUrl}/tournaments/${id}/logs${page ? `?page=${page}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getAllowedParticipants(id) {
    return this.http.get<Tournament>(`${this.baseUrl}/tournaments/${id}/returnParticipants/allowed/all`);
  }
  getAllParticipants(id) {
    return this.http.get<Tournament>(`${this.baseUrl}/tournaments/${id}/participants/all`);
  }

  publishBracket(id, payload) {
    return this.http.post(`${this.baseUrl}/tournaments/${id}/publishBracket`, payload);
  }

  publishSecondStageBracket(id) {
    return this.http.post(`${this.baseUrl}/tournaments/${id}/startNextStage`, {});
  }

  sendMessage(id, payload) {
    return this.http.post(`${this.baseUrl}/tournaments/${id}/sendTournamentMessage`, payload);
  }

  getIsFinishable(id) {
    return this.http.get(`${this.baseUrl}/tournaments/${id}/isFinishable`);
  }

  isNextStageReady(id) {
    return this.http.get(`${this.baseUrl}/tournaments/${id}/nextStageReady`);
  }

  redirectToStageRoute(tournament) {
    const url = this.router.url;
    const bracketType = Object.values(BRACKET_TYPES).find(type => url.includes(type));
    if (bracketType) {
      if (tournament.tree) {
        if (!tournament.tree.data[0].is_published) {
          if (!this.router.url.includes(tournament.tree.data[0].stage)) {
            // console.log('manage-tournaments/publish-brackets/' + bracketType)
            const type = tournament.tree.data[0].type === 'GroupStage' ? 'RoundRobin' : tournament.tree.data[0].type;
            this.router.navigate(['tournament/' + tournament.code + '/manage/publish-brackets/' + type])
          }

        }
      }
    }
  }
  getTournamentMessagesLogs(TournamentCode: string, page) {
    const data = this.fns.httpsCallable ('getTournamentLogs');
    return data({
      authorization: 'Bearer ' + localStorage.getItem('token'),
      code: TournamentCode,
      page
    });

  }

}
