import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Game} from "../../../shared/models/game";
import {map} from "rxjs/operators";
import {GamerProfile} from "../../../shared/models/gamer";
import {User} from "../../authentication/models/user";

@Injectable({
  providedIn: 'root'
})
export class GamerService {
  private baseUrl = environment.apiUrl
  private communityUrl = environment.communityApiUrl
  private supportApiUrl = environment.supportApiUrl
  private authApiUrl = environment.auth_apiUrl
  private storeUrl = environment.storeApiUrl
  slug: string;
  isAccountOwner: boolean;

  constructor(private http: HttpClient) {
  }

  getGamerProfile(slug: string): Observable<GamerProfile> {
    return this.http.get<GamerProfile>(`${this.baseUrl}/gamers/${slug}`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  getUpcomingMatches(slug: string , page = 1 , status): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/v2/tournaments/returnUpcomingMatchesByUsername/${slug}?per_page=12$&page=${page}${status ? `&status=${status}` : ''} `).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  getPreferences(slug: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${slug}/preferences`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  getMatchHistoryStats(slug: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/gamer/${slug}/matchesHistory?status=Finished&winner=1&type=single&page=1`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  getJoinedChallenges(slug: string, page: number = 1 , status?:string, search?:string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${slug}/challenges?page=${page}&per_page=12${status ? `&status=${status}` : ''}${search ? `&name=${search}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getJoinedTournaments(slug: string, page: number = 1 , status?:string , search?:string): Observable<any> {

    return this.http.get<any>(`${this.baseUrl}/gamers/${slug}/returnJoinedTournaments?page=${page}&per_page=12${status ? `&status=${status}` : ''}${search ? `&name=${search}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getUsersClaims(page?: number): Observable<any> {
    return this.http.get<any>(`${this.supportApiUrl}/winnersPayments/claims?page=${page}&per_page=8`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  updateProfile(payload: any): Observable<any> {
    return this.http.post<User>(`${this.authApiUrl}/users/updateProfile`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getLeagueServers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/lolServers`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getSocialAccounts(): Observable<any> {
    return this.http.get<any>(`${this.authApiUrl}/users/socialAccounts`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  disconnectSocialAccount(account_id): Observable<any> {
    return this.http.delete<any>(`${this.authApiUrl}/socialAccounts/${account_id}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  linkLeague(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/publisherAccounts`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  }

  verifyLeagueAccount(id: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/publisherAccounts/${id}/verify`, {}).pipe(
      map((response: any) => {
        return response;
      }));
  }

  deleteLeagueAccount(publisherAccountId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/publisherAccounts/${publisherAccountId}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  updatePublisherAccount(account_id: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/publisherAccounts/${account_id}/updateInformation`, {}).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getBlockedUsers(): Observable<any> {
    return this.http.get<any>(`${this.communityUrl}/blocks`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  enableUser2fa(body: any): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/users/2fa/enable`, body).pipe(
      map((response: any) => {
        return response;
      }));
  }

  verifyUser2fa(body: any): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/users/2fa/verify`, body).pipe(
      map((response: any) => {
        return response;
      }));
  }

  changeUserPassword(body: any): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/users/updatePassword`, body).pipe(
      map((response: any) => {
        return response;
      }));
  }

  disableUser2fa(): Observable<any> {
    return this.http.delete<any>(`${this.authApiUrl}/users/2fa/disable`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getRequiredInputs(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/requiredInputs`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getUsersRequiredInputs(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/requiredInputs`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getGamerRelation(id: number): Observable<any> {
    return this.http.get<any>(`${this.communityUrl}/friendship/relations/${id}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getThirdParties(){
    return this.http.get<any>(`${this.storeUrl}/thirdParty`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  disconnectThirdParty(phoneNumber){
    return this.http.delete<any>(`${this.storeUrl}/thirdParty?phone_number=${phoneNumber}`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  removeFriend(id: number): Observable<any> {
    return this.http.delete<any>(`${this.communityUrl}/friendship/${id}/unfriend`).pipe(
      map((response: any) => {
        return response;
      }));
  }
  changeReferenceNumber(payload){
    return this.http.put<any>(`${this.baseUrl}/users/customReferenceNumber`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  }
  changeCustomUpdate(payload){
    return this.http.put<any>(`${this.authApiUrl}/users/customUpdate`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  }
  isOwner(slug: any) {
    const userAuthString = localStorage.getItem('userAuth');
    const userAuth = userAuthString ? JSON.parse(userAuthString) : null;    // console.log(userAuth.id, id)
    return userAuth?.slug === slug;
  }
}
