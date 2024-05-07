import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment'
import {HttpClient} from '@angular/common/http'
import {Router} from '@angular/router'
import {map} from 'rxjs/operators'
import {GetConfirmedParticipants} from "../state/participants.action";
import {Actions, ofActionCompleted, Store} from "@ngxs/store";

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {
  private baseUrl = environment.apiUrl
  isActionLoading = false;

  constructor(private http: HttpClient, private router: Router, private store: Store, private actions$: Actions) {
  }

  getConfirmedParticipants(code, page, search?, country?, checkedIn?, incomplete?, selectedTag?) {
    return this.http.get<any>(`${this.baseUrl}/organizer/tournaments/${code}/returnParticipants/confirmed${page ? `?page=${page}` : ''}${search ? `&name=${search}` : ''}${country ? `&country=${country}` : ''}${checkedIn ? `&has_checked_in=${checkedIn}` : ''}${incomplete === false || incomplete ? `&incomplete=${incomplete}` : ''}${selectedTag ? `&highlights=${selectedTag}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getPendingParticipants(code, page, search?, country?, checkedIn?, incomplete?, selectedTag?) {
    return this.http.get<any>(`${this.baseUrl}/organizer/tournaments/${code}/returnParticipants/pending${page ? `?page=${page}` : ''}${search ? `&name=${search}` : ''}${country ? `&country=${country}` : ''}${checkedIn ? `&has_checked_in=${checkedIn}` : ''}${incomplete === false || incomplete ? `&incomplete=${incomplete}` : ''}${selectedTag ? `&highlights=${selectedTag}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  };

  getKickedParticipants(code, page, search?, country?, checkedIn?, incomplete?) {
    return this.http.get<any>(`${this.baseUrl}/organizer/tournaments/${code}/returnParticipants/kicked${page ? `?page=${page}` : ''}${search ? `&name=${search}` : ''}${country ? `&country=${country}` : ''}${checkedIn ? `&has_checked_in=${checkedIn}` : ''}${incomplete === false || incomplete ? `&incomplete=${incomplete}` : ''}`).pipe(
      map((response: any) => {
        return response;
      }));
  };

  // kickParticipants(code , id) {
  //   const payload = { id}
  //   console.log(payload)
  //   return this.http.post<any>(`${this.baseUrl}/tournaments/${code}/kickParticipant` , payload).pipe(
  //     map((response: any) => {
  //       return response;
  //     }));
  // }
  kickAllParticipants(code, ids, preventRejoin) {
    const payload = {ids, prevent_rejoin: preventRejoin}
    console.log(payload)
    return this.http.post<any>(`${this.baseUrl}/tournaments/${code}/participants/kick`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  }

  restoreParticipants(code, ids) {
    const payload = {ids}
    console.log(payload)
    return this.http.post<any>(`${this.baseUrl}/tournaments/${code}/participants/restore`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  }

  AcceptdisqualifyAllParticipants(code, ids, status) {
    // status 0 = disqualify , 1 = confirm
    const payload = {ids, status}
    return this.http.put<any>(`${this.baseUrl}/tournaments/${code}/participants/status`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  } ;

  disqualifyParticipant(code, ids) {
    const payload = {ids}
    console.log(payload)
    return this.http.post<any>(`${this.baseUrl}/tournaments/${code}/participants/disqualify`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  } ;

  checkInParticipant(code, participants, status) {
    const payload = {participants, status}
    console.log(payload)
    return this.http.post<any>(`${this.baseUrl}/tournaments/${code}/participants/checkIn`, payload).pipe(
      map((response: any) => {
        return response;
      }));
  } ;

  selectAllParticipants(code, type, search?, country?, checkedIn?, incomplete?) {
    let queryParams = '';
    if (search) {
      queryParams += `?name=${search}`;
    }
    if (country) {
      queryParams += `${queryParams ? '&' : '?'}country=${country}`;
    }
    if (checkedIn) {
      queryParams += `${queryParams ? '&' : '?'}has_checked_in=${checkedIn}`;
    }
    if (incomplete === false || incomplete) {
      queryParams += `${queryParams ? '&' : '?'}incomplete=${incomplete}`;
    }
    return this.http.get<any>(`${this.baseUrl}/tournaments/${code}/returnParticipants/${type}${queryParams}`).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getPDF(tournament, confirmation, page, search?, country?, checkedIn?, winners?) {
    return this.http
      .get(`${this.baseUrl}/tournaments/${tournament}/exportParticipants?confirmation=${confirmation ? 1 : 0}${page ? `&page=${page}` : ''}${search ? `&name=${search}` : ''}${country ? `&country=${country}` : ''}${checkedIn ? `&has_checked_in=${checkedIn}` : ''} ${winners ? `&winners=${winners}` : ''} `, {responseType: 'blob' as 'json'});
  }

  getFirstPageOfParticipants(type, tournamentCode, data) {
    // console.log(data.length)
    if (data.length === 0) {
      this.store.dispatch(new type(tournamentCode, 1))
      this.actions$.pipe(ofActionCompleted(GetConfirmedParticipants)).subscribe(() => this.isActionLoading = false);
    } else {
      this.isActionLoading = false
    }
  }


}
