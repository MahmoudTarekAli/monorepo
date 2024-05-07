import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Team} from "../../../shared/models/team";
import {AcceptTeamMember, CancelMemberRequest} from "../state/team.action";
import {Store} from "@ngxs/store";
import {GlobalService} from "../../../shared/service/global.service";

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private baseUrl = environment.apiUrl
  private communityUrl = environment.communityApiUrl
  private supportApiUrl = environment.supportApiUrl
  private authApiUrl = environment.auth_apiUrl
  teamId: string;
  isTeamOwner: boolean;
  constructor(private http: HttpClient , private store: Store , private globalService:GlobalService) {
  }

  createTeam(payload:any): Observable<[]> {
    return this.http.post<any>(`${this.baseUrl}/teams`,payload).pipe(
      map((response: any) => {
        return response.data;
      }));

  }
  updateTeam(id:string ,payload:any): Observable<[]> {
    return this.http.post<any>(`${this.baseUrl}/teams/${id}/update`,payload).pipe(
      map((response: any) => {
        return response;
      }));

  }
  getMyTeams(): Observable<[]> {
    return this.http.get<any>(`${this.baseUrl}/teams/myTeams`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
  getTeam(teamId:string ,tournamentId:string , isTournament?:boolean): Observable<[]> {
    if(isTournament){
      return this.http.get<any>(`${this.baseUrl}/tournaments/${tournamentId}/teams/${teamId}?original=${true}`).pipe(
        map((response: any) => {
          return response.data;
        }));
    }
    return this.http.get<Team>(`${this.baseUrl}/teams/${teamId}`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  uploadImage(payload:any): Observable<[]> {
    return this.http.post<any>(`${this.baseUrl}/teams/uploadImage`,payload).pipe(
      map((response: any) => {
        return response;
      }));

  }
  getTeamAuth(id:string): Observable<[]> {
    return this.http.get<any>(`${this.baseUrl}/teams/${id}/roles`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  getTeamMatchHistoryStats(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/team/${id}/matchesHistory?status=Finished&winner=0&type=single&page=1`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
  getTeamUpcomingMatches(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/teams/${id}/upcomingMatches`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }

  getTeamJoinedTournaments(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/teams/${id}/returnJoinedTournaments`).pipe(
      map((response: any) => {
        return response.data;
      }));
  }
  getInvitationByCode(code:string) {
    return this.http.get(`${this.baseUrl}/invitations/${code}`).pipe(
      map((response: any) => {
          return response.data;
        }));
  }

  acceptInvitation(invitationCode:string, requiredInputs?:any, required_accounts?:any) {
    let body;

    if(requiredInputs ){
      body = {additional_data: {
          userSupportedRequiredInputsKey: requiredInputs ,
        }};
    }
    if (required_accounts){
      body.additional_data = {...body.additional_data , required_accounts: [required_accounts]}
    }
    if (body?.additional_data){
      this.globalService.removeEmptyKeys(body?.additional_data);
    }

    return this.http.post(`${this.baseUrl}/invitations/${invitationCode}/accept`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  selectRole(id:string , payload:any , isTournament?:boolean): Observable<any> {
    if(isTournament){
      return this.http.put(`${this.baseUrl}/tournaments/${id}/teams/roles`, payload).pipe(
        map((response: any) => {
          return response;
        })
      );
    }
    return this.http.put(`${this.baseUrl}/teams/${id}/participants/roles`, payload).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  deleteTeam(id:string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/teams/${id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  removeMember(team_id:string , member_id:string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/teams/${team_id}/members/${member_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  leaveTeam(team_id:string): Observable<any> {
    return this.http.post(`${this.baseUrl}/teams/${team_id}/leave`, {}).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  unSelectTournamentTeamMember(tournamentId:string , team_id:string , id:number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tournaments/${tournamentId}/editTeam/${team_id}/deleteParticipant?member_id=${id}&original=${true}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  selectTournamentTeamMember(tournamentId:string , team_id:string , payload:any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tournaments/${tournamentId}/editTeam/${team_id}/addParticipant?original=${true}`, payload).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateTeamRequiredInputs(tournamentId:string , team_id:string , payload:any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tournaments/${tournamentId}/teams/${team_id}/updateTeamMembersRequiredInputs`, payload).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  assignLeader(tournamentId:string , teamId:string , payload:any): Observable<any> {
    return this.http.put(`${this.baseUrl}/tournaments/${tournamentId}/teams/${teamId}/leaderAssignment?original=${true}`, payload).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  compareRequiredInputs(tournamentCode:string , slug:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/tournaments/${tournamentCode}/requiredInputs/compare?slug=${slug}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  acceptJoinRequest(id:string , direction:string , member:any , numberOfTeam?:number , additional_data?:any){
    if (additional_data?.required_accounts && member){
      member.required_accounts =  additional_data?.required_accounts;
    }
    if (additional_data?.userSupportedRequiredInputsKey && member){
      member.supported_required_inputs = additional_data?.userSupportedRequiredInputsKey;
    }
    this.store.dispatch(new AcceptTeamMember(id , direction , member , numberOfTeam ))
  }
  cancelInvitationRequest(id:string , type:string){
    this.store.dispatch(new CancelMemberRequest(id , type))
  }
}
