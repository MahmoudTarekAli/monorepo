import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Tournament} from "../../../shared/models/tournament";
import {map} from "rxjs/operators";
import {GlobalService} from "../../../shared/service/global.service";

@Injectable({
  providedIn: 'root'
})
export class RiotRamadanService {
  private baseUrl = environment.apiUrl

  constructor(private http: HttpClient, private globalService:GlobalService) {

  }


  getEventQuests(game?: string, type?: string): Observable<any> {
    const headers = new HttpHeaders().set('Accept-Language', this.globalService.selectedLanguage.includes('ar') ? 'ar' : 'en');

    return this.http.get<any>(`${this.baseUrl}/events/riot-ramadan-quests/quests?game=${game}&type=${type}`, { headers }).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  claimPrize(id: string): Observable<any> {
    const headers = new HttpHeaders().set('Accept-Language', this.globalService.selectedLanguage.includes('ar') ? 'ar' : 'en');

    return this.http.post<any>(`${this.baseUrl}/quests/${id}/claimPrize`, {} ,{ headers }).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
}
