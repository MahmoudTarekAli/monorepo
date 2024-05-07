import {Injectable} from '@angular/core';
import {environment} from "../../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Tournament} from "../../../../tournaments/models/tournament";
import {HandleError, SetNotifications} from "../../../../../shared/state/global.action";
import {Store} from "@ngxs/store";

@Injectable({
  providedIn: 'root'
})
export class TournamentBracketService {
  isVisible = false;
  private baseUrl = environment.apiUrl
  private communityApiUrl = environment.communityApiUrl

  constructor(private http: HttpClient , private store: Store) {
  }

  updateBracket(payload, id) {
    return this.http.post<any>(`${this.baseUrl}/tournaments/${id}/changeBracket`, payload);
  }
  saveBracketSettings(payload) {
    return this.http.post<any>(`${this.baseUrl}/bracket/template`, payload);
  }
  getBracketSettings(type , status?) {
    return this.http.get<any>(`${this.baseUrl}/bracket/template?type=${type}${status ? '&status=' + status : ''}`);
  }
  deleteBracketSetting(id) {
    return this.http.delete<any>(`${this.baseUrl}/bracket/template/${id}`);
  }



  saveBracketSetting(name , type , settings ) {
    const body = { type , status: 'private', settings , name}
    this.saveBracketSettings(body).subscribe(bracket => {
      this.store.dispatch(new SetNotifications('Success', 'Bracket settings saved successfully', 'success'))
      this.isVisible = false;
    }, error => {
      this.store.dispatch(new HandleError(error))
    })

  }
}
