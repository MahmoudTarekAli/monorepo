import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment'
import {HttpClient} from '@angular/common/http'
import {Router} from '@angular/router'
import {map} from 'rxjs/operators'
import {Actions, ofActionCompleted, Select, Store} from "@ngxs/store";
import {ActionsExecuting, hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {GetTournamentAllMatches} from "../../issues-claims/state/issues-claims.action";
import {Observable} from "rxjs";
import {GetTournament} from "../../../tournament-process/state/tournament-process.action";

@Injectable({
  providedIn: 'root'
})
export class WinnersService {
  private baseUrl = environment.apiUrl
  isActionLoading = false;

  constructor(private http: HttpClient, private router: Router, private store: Store, private actions$: Actions) {
  }

  getWinners(code, page, search?, country?) {
    return this.http.get<any>(`${this.baseUrl}/organizer/tournaments/${code}/returnParticipants/winners${page ? `?page=${page}` : ''}${search ? `&name=${search}` : ''}${country ? `&country=${country}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

}
