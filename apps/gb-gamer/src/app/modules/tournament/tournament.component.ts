import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {GetTeamAuthority, GetTournament} from "./state/tournament.action";
import {TournamentState} from "./state/tournament.state";
import {filter, Observable, skip, Subject, take, takeUntil} from "rxjs";
import {Tournament} from "../../shared/models/tournament";
import {
  IsJoined,
  OpenJoinTournamentDialog,
  UpdateIsJoined,
  UpdateIsJoinedData
} from "./state/join-tournament/join-tournament.action";
import {JoinTournamentState} from "./state/join-tournament/join-tournament.state";
import {JoinTournamentComponent} from "../../shared/components/join-tournament/join-tournament.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {StepperStep} from "./models/stepper-step";
import {TournamentService} from "./service/tournament.service";
import {GetChallengesList} from "../challenges/state/challenges.action";
import {GetMonthlyJoinCount, HandleError, SetNotifications} from "../../shared/state/global.action";
import {GetNotifications} from "../../components/notifications/state/notifications.action";
import {map} from "rxjs/operators";
import {GlobalState} from "../../shared/state/global.state";
import {FaqComponent} from "../arena/custom-arenas/etisalat-arena/modals/faq/faq.component";
import {PremiumCardAlertComponent} from "../../shared/components/premium-card-alert/premium-card-alert.component";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Team} from "../../shared/models/team";
import {AuthService} from "../authentication/services/auth.service";
import {environment} from "../../../environments/environment";

import {AuthenticationState} from "../authentication/state/authentication.state";
import {GlobalService} from "../../shared/service/global.service";
import {User} from "../authentication/models/user";
import {StateReset} from "ngxs-reset-plugin";
import {MatchListState} from "./match-list/state/match-list.state";

@UntilDestroy()
@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss'],
})
export class TournamentComponent implements OnInit, OnDestroy {
  @Select(TournamentState.getTournament) tournament$: Observable<Tournament>;
  @Select(TournamentState.geTeamAuthority) isTeamAuthority$: Observable<boolean>;
  @Select(JoinTournamentState.getIsJoinedData) isJoinedData$: Observable<any>;
  @Select(GlobalState.getMonthlyJoinsCounts) monthlyJoinsCounts$: Observable<any>;
  @Select(AuthenticationState.getUser) user$: Observable<User>;

  monthlyJoinsCount: number
  monthlyJoinsLimit: number
  isLeaveDialogVisible: boolean
  isTournamentActionDialogVisible: boolean
  tournamentId: string
  private ngUnsubscribe = new Subject<void>();
  tournament: Tournament
  team: Team
  isSuperAdmin: boolean
  tournamentActions = [
    {label: 'Sponsored', value: 'is_featured', checked: false},
    {label: 'Featured', value: 'homepage_highlighted', checked: false},
    {label: 'Guaranteed Prizes', value: 'guaranteed_prizes', checked: false}
  ];
  tabs = [
    {
      title: 'Summary',
      path: `summary`,
      key: 'summary'
    },
    {
      title: 'Participants',
      path: `participants`,
      key: 'participants'

    },

    {
      title: 'Rules',
      path: `rules`,
      key: 'rules'
    },
    {
      title: 'Match List',
      path: `match-list`,
      key: 'match-list'
    },
    {
      title: 'Bracket',
      path: `bracket`,
      key: 'bracket'

    }
  ];
  isDialogOpenable: boolean
  selectedTabIndex: number
  isCheckedIn = false
  isUserLoggedIn: boolean
  tournamentAuthority: string
  organizerUrl = environment.organizerUrl

  constructor(private router: Router, private authService: AuthService, private actions$: Actions, private activatedRoute: ActivatedRoute, private globalService: GlobalService,
              private store: Store, private modalService: NzModalService, private tournamentService: TournamentService) {
    this.globalService.getSocialLoginError()
  }

  user: User

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.tournamentService.tournamentCode = params['id'];
      this.tournamentService.tournamentCode = this.activatedRoute.snapshot.params['id'];
      this.store.dispatch(new GetTournament(this.tournamentService.tournamentCode));
      // this.store.dispatch(new IsJoined(this.tournamentService.tournamentCode));
    })
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateSelectedTabIndex();
      });
    this.updateSelectedTabIndex();

    this.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.isUserLoggedIn = this.authService.isUserLoggedIn()
      this.isSuperAdmin = data?.roles.some((role: any) => role.name === 'SuperAdmin');
      console.log(this.isSuperAdmin)
    })

    console.log(this.isUserLoggedIn)
    const user = JSON.parse(localStorage.getItem('userAuth'))
    this.user = user
    this.store.dispatch(new GetMonthlyJoinCount(user?.slug))
    this.isJoinedData$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.team = data.team
      if (data?.team) {
        this.store.dispatch(new GetTeamAuthority(this.tournamentService.tournamentCode, data.team.id));
        this.isTeamAuthority$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
          if (res === true) {
            if (!this.tabs.some(tab => tab.key === 'team-settings')) {
              this.tabs.push({
                title: 'Team Settings',
                path: `team-settings`,
                key: 'team-settings'
              })
            }
            this.updateSelectedTabIndex();

          }
        })

      }

    })
    this.monthlyJoinsCounts$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: any) => {
      if (data?.count || data?.limit) {
        this.monthlyJoinsCount = data.count
        this.monthlyJoinsLimit = data.limit
      }
    })
    this.tournament$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.tournament = data
      if (data?.participants_type == 'teams') {
        this.isTeamAuthority$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
          if (res === true) {
            if (!this.tabs.some(tab => tab.key === 'team-settings')) {
              this.tabs.push({
                title: 'Team Settings',
                path: `team-settings`,
                key: 'team-settings'
              })
            }
            this.updateSelectedTabIndex();

          }
        })
      }
      if (this.tournament?.stage_type === 'FreeForAll') {
        this.tabs = this.tabs.filter(item => item.key !== 'match-list')
      }
    })

    this.tournamentId = this.activatedRoute.snapshot.params['id'];
    this.tournamentService.checkTournamentAuthority(this.tournamentId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(authority => {
      this.tournamentAuthority = authority.Authority
    }, error => {
      this.store.dispatch(new HandleError(error))
    })
    this.store.dispatch(new GetTournament(this.tournamentId));
    this.store.dispatch(new IsJoined(this.tournamentId));
    this.tournament$.pipe(takeUntil(this.ngUnsubscribe), skip(1)).subscribe(tournament => {
      this.isDialogOpenable = tournament.supportedRequiredInputsKeys.length > 0 || tournament.participants_type === 'teams' || tournament.required_accounts.length > 0 || tournament.show_rules;
      console.log(this.isDialogOpenable)
    })


  }

  updateSelectedTabIndex() {
    const currentPathSegment = this.activatedRoute.snapshot.firstChild?.url[0]?.path;
    this.selectedTabIndex = this.tabs.findIndex(tab => currentPathSegment && currentPathSegment.includes(tab.key));

  }

  onTabSelected(index: number): void {
    this.router.navigate([this.tabs[index].path], {relativeTo: this.activatedRoute});
  }

  log(value: object[]): void {
    console.log(value);
  }

  openTournamentActionDialog() {
    this.isTournamentActionDialogVisible = true
    this.tournamentService.getTournamentUnCached(this.tournamentId).subscribe(data => {
      this.tournamentActions.map(action => {
        const apiValue = data[action.value];
        if (apiValue !== undefined) {
          action.checked = apiValue;
        }
      });
    })

  }

  checkIn() {
    this.tournamentService.checkIn(this.tournamentId, this.tournament.participants_type === 'teams' ? this.team.id : localStorage.getItem('User')).subscribe(data => {
      this.isCheckedIn = true
      this.store.dispatch(new SetNotifications('Success', 'You have checked In Successfully', 'success'))
      // fix for checkin button until make an action to update checkIn Status
      this.store.dispatch(new IsJoined(this.tournamentId));
    }, error => {
      this.store.dispatch(new HandleError(error))
    })

  }

  manageTournament() {
    window.location.href = environment.organizerUrl + '/tournament/' + this.tournamentId
  }

  openJoinTournamentDialog(): any {

    this.isUserLoggedIn = this.authService.isUserLoggedIn()
    this.authService.checkAuthority()
    if (this.isUserLoggedIn) {
      console.log(this.isDialogOpenable)
      if (!this.isDialogOpenable) {
        const joinTournamentState = this.store.selectSnapshot(JoinTournamentState); // Get the current state snapshot
        return this.tournamentService.joinTournament(this.tournamentId).subscribe(data => {
          joinTournamentState.isJoinedData.is_joined = true
          joinTournamentState.isJoinedData.is_joinable = false
        }, error => {
          this.store.dispatch(new HandleError(error))
        })
      } else {
        this.isDialogOpenable = true
        if (this.monthlyJoinsCount >= this.monthlyJoinsLimit && !this.authService.userAuth?.is_premium) {
           this.modalService.create({
            nzContent: PremiumCardAlertComponent,
            nzFooter: null,
            nzData: {type: 'tournaments'},
            nzCentered: true,
            nzWidth: '600px',
             nzClassName:'challenge-modal',

           })
        } else {
          const modal = this.modalService.create({
            nzTitle: 'Join Tournament',
            nzContent: JoinTournamentComponent,
            nzData: {tournamentId: this.tournamentId, team: this.team},
            nzFooter: null,
            nzWidth: 800
          })

        }

      }
    }


  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
    this.store.dispatch(
      new StateReset(MatchListState)
    );
    this.store.dispatch(
      new StateReset(TournamentState)
    );
  }

  saveTournamentAction() {
    const actions = {};
    this.tournamentActions.forEach(item => {
      actions[item.value] = item.checked;
    });
    this.tournamentService.saveTournamentAction(this.tournamentId, actions).subscribe(data => {
      this.isTournamentActionDialogVisible = false
      this.store.dispatch(new SetNotifications('Success', 'You have checked In Successfully', 'success'))
    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }

  leaveTournament() {
    const joinTournamentState = this.store.selectSnapshot(JoinTournamentState); // Get the current state snapshot
    if (this.tournament.participants_type === 'teams' && (this.team.owner.id === this.user.id)) {
      this.tournamentService.unJoinTournament(this.tournamentId, this.team.id).subscribe(data => {
        joinTournamentState.isJoinedData.is_joined = false
        joinTournamentState.isJoinedData.is_joinable = true
        this.store.dispatch(new UpdateIsJoinedData(joinTournamentState.isJoinedData))
        this.isLeaveDialogVisible = false
        this.isCheckedIn = false
        this.tabs = this.tabs.filter(item => item.key !== 'team-settings')
        this.router.navigateByUrl(`/tournaments/${this.tournamentId}`)
      }, error => {
        this.store.dispatch(new HandleError(error))
      })
    } else {
      this.tournamentService.unJoinTournament(this.tournamentId).subscribe(data => {
        joinTournamentState.isJoinedData.is_joined = false
        joinTournamentState.isJoinedData.is_joinable = true
        this.store.dispatch(new UpdateIsJoinedData(joinTournamentState.isJoinedData))
        this.isLeaveDialogVisible = false
        this.isCheckedIn = false
        this.router.navigateByUrl(`/tournaments/${this.tournamentId}`)

      }, error => {
        this.store.dispatch(new HandleError(error))
      })
    }

  }
}
