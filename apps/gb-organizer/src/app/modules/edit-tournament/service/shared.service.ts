import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  tournamentCode;
  authorityType;
  private baseUrl = environment.apiUrl
  touranmentData = []
  constructor(private http: HttpClient) {
  }
  checkAuthority(code) {
    return this.http.get<any>(`${this.baseUrl}/tournaments/${code}/checkAuthority`).pipe(
      map((response: any) => {
        return response;
      }));
  }

}

