import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Tournament} from "../../../shared/models/tournament";
import {map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = environment.searchApiUrl
  private communityUrl = environment.communityApiUrl

  constructor(private http: HttpClient) {
  }

  search(word: string | undefined): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search?word=${encodeURIComponent(word)}`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }


  searchFiltered(word: string , api:string, page: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/${api}?word=${word}&page=${page}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

}
