import {Component, OnInit} from '@angular/core';
import {GetTournament} from '../../tournament-process/state/tournament-process.action'
import {Select, Store} from '@ngxs/store'
import {GetTournamentAllParticipants, ManagedTournamentLogs} from '../state/manage-tournament.action'
import {ActivatedRoute, Router} from '@angular/router'
import {TournamentProcessState} from '../../tournament-process/state/tournament-process.state'
import {Observable} from 'rxjs'
import {ManageTournamentState} from '../state/manage-tournament.state'
import {AuthenticationState} from '../../../authentication/state/authentication.state'
import {ActionsExecuting, hasActionsExecuting} from '@ngxs-labs/actions-executing'
import {GetTournaments} from '../../../tournaments/state/tournament.action'
import {SharedService} from "../../service/shared.service";
import {ManageTournamentService} from "../services/manage-tournament.service";

@Component({
  selector: 'app-tournament-logs',
  templateUrl: './tournament-logs.component.html',
  styleUrls: ['./tournament-logs.component.scss']
})
export class TournamentLogsComponent implements OnInit {
  index = 0
  tournament;
  currentPage = 1;
  messagePage = 1;
  text: any = {
    Year: 'Year',
    Month: 'Month',
    Weeks: 'Weeks',
    Days: 'D',
    Hours: 'h',
    Minutes: 'm',
    Seconds: 's',
    MilliSeconds: 'MilliSeconds'
  };
  messageLogs: any;
  isMessageLoading = false;
  allParticipants: any;
  participantsLogs: any;
  isVisible = false;
  constructor(private store: Store, private route: ActivatedRoute, private router: Router, private sharedService: SharedService , private manageTournamentService: ManageTournamentService){
  }

  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>
  @Select(ManageTournamentState.getTournamentLogs) logs: Observable<any>
  @Select(AuthenticationState.getAuth) userData: Observable<{}>;
  @Select(hasActionsExecuting([ManagedTournamentLogs])) getManageIsExecuting$: Observable<ActionsExecuting>;

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      if (param?.page) {
        this.currentPage = param.page
      }
    })
    this.store.dispatch(new ManagedTournamentLogs(this.sharedService.tournamentCode))
    this.getManageIsExecuting$.subscribe(res => {
      console.log(res)
    })
    this.getTournament.subscribe(res => {
      if (res?.code) {
        this.tournament = res
      }
    })
    this.manageTournamentService.getTournamentMessagesLogs(this.sharedService.tournamentCode , 1).subscribe(res => {
      this.messageLogs = res
      console.log(this.messageLogs)
    })
    this.manageTournamentService.getAllParticipants(this.sharedService.tournamentCode).subscribe((res: any) => {
      this.allParticipants = res?.data
    })
    console.log( this.allParticipants)
  }

  ChangeLogsPage(page) {
    this.store.dispatch(new ManagedTournamentLogs(this.tournament.code, page))
  }
  changeMessageLogsPage(page){
    this.isMessageLoading = true
    this.messagePage = page
    this.manageTournamentService.getTournamentMessagesLogs(this.sharedService.tournamentCode , page).subscribe(res => {
      this.messageLogs = res
      this.isMessageLoading = false
    })
  }

  resetPagination() {
    if (this.currentPage > 1){
      this.currentPage = 1
      this.store.dispatch(new ManagedTournamentLogs(this.tournament.code, this.currentPage))
    }
  }
  openParticipantsModal(data){
    // filter array allParticipants with array of data with id
    this.participantsLogs = this.allParticipants.filter((item) => data.includes(item.id))
    console.log(this.participantsLogs)
    this.isVisible =  !this.isVisible
  }
  handleCancel(){
    this.isVisible = false
  }

}
