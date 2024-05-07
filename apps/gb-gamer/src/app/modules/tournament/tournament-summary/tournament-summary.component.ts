import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {TournamentState} from "../state/tournament.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {Tournament} from "../../../shared/models/tournament";
import {JoinTournamentState} from "../state/join-tournament/join-tournament.state";
import {FollowUnFollowArena} from "../../arena/state/arenas.action";
import {AuthService} from "../../authentication/services/auth.service";
import {IsArenaFollowed} from "../state/tournament.action";
import {User} from "../../authentication/models/user";
import {ViewTeamComponent} from "../../../shared/components/view-team/view-team.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {GameSettingsComponent} from "../../../shared/components/game-settings/game-settings.component";
import {TournamentService} from "../service/tournament.service";
import {HandleError} from "../../../shared/state/global.action";
import {UpdateIsJoinedData} from "../state/join-tournament/join-tournament.action";

@Component({
  selector: 'app-tournament-summary',
  templateUrl: './tournament-summary.component.html',
  styleUrls: ['./tournament-summary.component.scss']
})
export class TournamentSummaryComponent implements OnInit, OnDestroy {
  @Select(TournamentState.getTournament) tournament$: Observable<Tournament>;
  @Select(JoinTournamentState.getIsJoinedData) isJoinedData$: Observable<any>;
  @Select(TournamentState.isArenaFollowed) isArenaFollowed$: Observable<any>;
  private ngUnsubscribe = new Subject<void>();
  isFollowingArena: boolean
  contactDialog: boolean
  user: User
  requestsDialog: boolean
  isMobileView = false
  isEtisalateArena: boolean

  constructor(private authService: AuthService, private store: Store, private nzModalService: NzModalService, private tournamentService: TournamentService) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userAuth'))
    console.log(this.user)
    this.tournament$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tournament => {
      this.isEtisalateArena = tournament?.arena?.slug.includes('etisalat-gaming-eg')
      console.log(this.isEtisalateArena)
      this.store.dispatch(new IsArenaFollowed(tournament.arena?.slug))
    })
    this.isArenaFollowed$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(arena => {
      this.isFollowingArena = arena
      console.log(this.isFollowingArena)
    })
    this.store.select((state: { setting: any; }) => state.setting).subscribe(data => {
      const state = data.setting
      this.isMobileView = state.isMobileView;
      console.log(this.isMobileView)
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
    console.log(this.ngUnsubscribe)
  }

  followUnfollowArena(arena, type: string) {
    console.log(arena.slug)
    this.authService.checkAuthority()
    this.store.dispatch(new FollowUnFollowArena(arena.slug, type))
  }

  openGameSettings(settings) {
    this.nzModalService.create({
      nzTitle: 'Game Settings',
      nzContent: GameSettingsComponent,
      nzData: {
        settings: settings
      },
      nzFooter: null,
      nzCentered: true,
      nzWidth: '600px',

    })

  }

  getContactValue(contact) {
    let value;
    if (contact.value) {
      switch (contact.key) {
        case 'phone': {
          value = 'tel:' + JSON.stringify(contact.value.replace(/ /g, ''));
          break;
        }
        case 'email': {
          value = 'mailto:' + contact.value;
          break;
        }
        case 'website':
        case 'instagram':
        case 'facebook':
        case 'twitter':
        case 'twitch':
        case 'discord':
        case 'youtube': {
          if (contact.value.indexOf('http') === -1) {
            value = 'https://' + contact.value;
          } else {
            value = contact.value;
          }
          break;
        }
        default:
          value = contact.value;
      }

    }
    return value;
  }

  cancelJoinRequest(requestId, requests, index) {
    const joinTournamentState = this.store.selectSnapshot(JoinTournamentState); // Get the current state snapshot
    this.tournamentService.cancelJoinTeamRequest(requestId).subscribe(data => {
      joinTournamentState.isJoinedData.requests.team_joining_request.splice(index, 1)
      joinTournamentState.isJoinedData.requests.team_joining_request_count = requests.team_joining_request_count - 1
      if (requests.team_joining_request_count === 0) {
        this.requestsDialog = false
        joinTournamentState.isJoinedData.is_joinable = true
      }
      this.store.dispatch(new UpdateIsJoinedData(joinTournamentState.isJoinedData))

    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }

}
