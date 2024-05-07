import {Component, OnDestroy, OnInit} from '@angular/core'
import {GetTournament, GetUserAuthority, ResetTree} from './tournament-process/state/tournament-process.action'
import {ActivatedRoute} from '@angular/router'
import {Actions, ofActionSuccessful, Select, Store} from '@ngxs/store'
import {SharedService} from './service/shared.service'
import {EmptyTournamentParticipants} from './manage-tournaments/state/manage-tournament.action'
import {TournamentProcessState} from "./tournament-process/state/tournament-process.state";
import {Observable} from "rxjs";
import {SetMissingFields} from "../../shared/state/global.action";
import {SidebarEnum} from "../../core/sidebar.enum";
import {StateClear, StateReset, StateResetAll} from "ngxs-reset-plugin";
import {ManageTournamentState} from "./manage-tournaments/state/manage-tournament.state";
import {SettingState} from "../../store/setting_ngxs/setting.state.";
import {AuthenticationState} from "../authentication/state/authentication.state";
import {GlobalState} from "../../shared/state/global.state";
import {TournamentState} from "../tournaments/state/tournament.state";
import {MatchListState} from "./manage-tournaments/match-list/state/match-list.state";
import {ResetBracket} from "./manage-tournaments/match-list/state/match-list.action";
import {SetStateActionNgxs} from "../../store/setting_ngxs/actions";

@Component({
  selector: 'app-edit-tournament',
  template: `
    <div (click)="toggleMobileMenu()" *ngIf="isMobileView" class="d-flex justify-content-end">
      <img width="30" src="https://d229ik2y8x56hm.cloudfront.net/frontend/assets/nav-icons/menu_burger-icon.svg">
    </div>
    <router-outlet></router-outlet>`,
})
export class EditTournamentComponent implements OnInit, OnDestroy {
  tournamentId: string
  isMobileMenuOpen
  isMobileView: boolean;
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;
  @Select(TournamentProcessState.getAuthority) getAuthority$: Observable<any>;

  constructor(private activatedRoute: ActivatedRoute, private store: Store, private sharedService: SharedService, private actions$: Actions) {
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting
      this.isMobileMenuOpen = state.isMobileMenuOpen;
      this.isMobileView = state.isMobileView

    })
  }

  ngOnInit(): void {
    this.sharedService.tournamentCode = this.activatedRoute.snapshot.params.id
    // console.log(this.tournamentId)
    this.store.dispatch(new GetTournament(this.sharedService.tournamentCode))
    this.actions$.pipe(ofActionSuccessful(GetTournament)).subscribe(() => {
      this.getTournament.subscribe((tournament) => {
        console.log(tournament)
        if (tournament) {
          // !tournament.country  || !tournament.description
          if (!tournament.name || !tournament.start_at) {
            this.store.dispatch(new SetMissingFields(SidebarEnum.tournament_info, true))
          } else {
            this.store.dispatch(new SetMissingFields(SidebarEnum.tournament_info, false))
          }
          if (!tournament?.tree?.data || tournament?.tree?.data.length < 1) {
            this.store.dispatch(new SetMissingFields(SidebarEnum.tournament_bracket, true))
            console.log('heree')
          } else {
            console.log('heree')
            this.store.dispatch(new SetMissingFields(SidebarEnum.tournament_bracket, false))

          }
        }

      })
    });
    this.actions$.pipe(ofActionSuccessful(ResetBracket)).subscribe((bracket) => {
      this.store.dispatch(new ResetTree(bracket.tournamentCode, bracket.stageIndex))
    });
    // this.store.dispatch(new GetUserAuthority(this.sharedService.tournamentCode))
    // this.getAuthority$.subscribe((res) => {
    //   this.sharedService.authorityType = res
    // })

  }
  toggleMobileMenu() {
    this.store.dispatch(
      new SetStateActionNgxs({
        isMobileMenuOpen: !this.isMobileMenuOpen,
      }),
    );
  }
  ngOnDestroy() {
    this.store.dispatch(new EmptyTournamentParticipants())
    // this.store.reset({})
    this.store.dispatch(
      new StateResetAll(AuthenticationState, SettingState, TournamentState)
    );
    this.store.dispatch(
      new StateReset(GlobalState)
    );
  }

}
