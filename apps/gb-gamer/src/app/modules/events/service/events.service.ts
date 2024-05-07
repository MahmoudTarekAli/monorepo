import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {Tournament} from "../../../shared/models/tournament";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = environment.apiUrl
  private communityUrl = environment.communityApiUrl

  constructor(private http: HttpClient) {
  }

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/events/featured`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  getEvent(slug: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/events/${slug}`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  getEventTournaments(slug: string, type: string, gameCode: string, page: any = 1): Observable<any[]> {
    let params = '';
    if (gameCode) {
      params += `&game=${gameCode}`;
    }
    if (type) {
      params += `&playables_type=${type}`;
    }
    return this.http.get<any[]>(`${this.baseUrl}/events/${slug}/playables?page=${page}${params}&per_page=8`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getEventChallenges(slug: string , game?:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/events/${slug}/challenges${game ? `?game=${game}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getEventPlayables(slug: string, page?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/events/${slug}/playables?page=${page}&limit=8`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getEventArenas(slug: string, page?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/events/${slug}/arenas?page=${page}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  createEvent(body: string): Observable<any[]> {
    return this.http.post<any>(`${this.baseUrl}/events`, body).pipe(
      map((response: any) => {
        return response;
      }));
  }

  updateEvent(body: string, id: string): Observable<any[]> {


    return this.http.post<any>(`${this.baseUrl}/events/${id}`, body).pipe(
      map((response: any) => {
        return response;
      }));
  }

  deleteEvent(id): Observable<any[]> {
    return this.http.delete<any>(`${this.baseUrl}/events/${id}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getArenas() {
    return this.http.get<any>(`${this.communityUrl}/arenas/organizer/myArenas`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
}
