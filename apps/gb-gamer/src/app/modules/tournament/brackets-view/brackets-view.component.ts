import {Component, OnDestroy, OnInit} from '@angular/core';
import {Actions, ofActionCompleted, ofActionDispatched, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {GetMatches, QualifyWinner, ResetBracket, UpdateMatchScore} from "../match-list/state/match-list.action";
import {Observable, Subject} from "rxjs";
import {ActionsExecuting, hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {BracketViewState} from "./state/bracket-view.state";
import {take, takeUntil} from "rxjs/operators";
import {MatchListState} from "../match-list/state/match-list.state";
import * as io from "socket.io-client";
import {TournamentState} from "../state/tournament.state";
import {Tournament} from "../../../shared/models/tournament";
import {BRACKET_TYPES, STAGES} from 'src/app/core/tournament.enum';
import {AuthenticationState} from "../../authentication/state/authentication.state";
import {environment} from "../../../../environments/environment";
import {GlobalService} from "../../../shared/service/global.service";
import {SocketService} from "../../../shared/service/socket.service";
import {TournamentService} from "../service/tournament.service";

@Component({
  selector: 'app-brackets-view',
  templateUrl: './brackets-view.component.html',
  styleUrls: ['./brackets-view.component.scss']
})
export class BracketsViewComponent implements OnInit, OnDestroy {
  zoom = 1;
  scaleX = 0;
  scaleY = 0;
  @Select(TournamentState.getTournament) getTournament: Observable<Tournament>;

  @Select(hasActionsExecuting([GetMatches])) isGetMatches$: Observable<ActionsExecuting>;
  tournament: Tournament
  private readonly unsubscribe$: Subject<void> = new Subject();
  bracket
  selectedStage = 0
  stagesMatches: any
  stageMatchesType: any
  isStageFreeForAll: boolean
  loading = false
  BRACKET_TYPES = BRACKET_TYPES
  bracketType: string
  mobView = false
  @Select(BracketViewState.getMatches) getMatches: Observable<any>
  @Select(BracketViewState.getWinnerMatches) getWinnerMatches: Observable<any>
  @Select(BracketViewState.getLoserMatches) getLoserMatches: Observable<any>
  @Select(MatchListState.getTournamentStage) getTournamentStage$: Observable<any>;
  @Select(AuthenticationState.getUser) getUser: Observable<any>;
  user: any
  matches: any
  groupsParticipants
  selectedGroupIndex = 0
  STAGES = STAGES
  stages: any
  selectedMatchIndex: any
  string = String
  rounds: any
  roundsTitle: any
  selectedTitle = 1
  tournamentsNameSpace: any
  Socket = environment.Socket
  selectedBracketMatchType: any
  isFullScreenEnabled = false;

  constructor(private sharedService: GlobalService, private tournamentService: TournamentService, private store: Store, private actions$: Actions, private socketService: SocketService) {
    if (window.innerWidth > 992) {
      this.mobView = false;
    }
    if (window.innerWidth <= 992) {
      this.mobView = true;
    }
    this.tournamentsNameSpace = io.io(this.Socket + '/tournaments', {
      transports: ['polling'],
      reconnection: true,
      upgrade: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      timeout: 5000,
      autoConnect: true
    });
    this.tournamentsNameSpace.emit('Join', this.tournamentService.tournamentCode);
    this.tournamentsNameSpace.emit('Count', this.tournamentService.tournamentCode);

  }

  ngOnInit(): void {


    this.selectedMatchIndex = 0
    this.loading = true
    this.store.dispatch(new GetMatches(this.tournamentService.tournamentCode, this.selectedStage))
    this.store.select(state => state.match_list).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log(data)
      this.stagesMatches = data;
      this.stages = data.stages
      // checking if second or first stage matches exist to stop loading
      this.bracketType = this.stages?.[this.selectedStage]?.type
      this.getSelectedFreeForAllGroupsMatches()
      // setTimeout(() => {
      this.checkBracket()

      // }, 1000)


    })

    this.getUser.subscribe(user => {
      this.user = user
      console.log(this.user)
    })
    this.socketService.listen(this.tournamentsNameSpace, this.tournamentService.tournamentCode).subscribe((res: any) => {
      console.log(res)

      if (res.sender_id !== this.user.id) {
        for (const match of res?.matches) {
          console.log(match.matches)
          this.store.dispatch(new UpdateMatchScore(this.selectedBracketMatchType, match, {
            score_home: match?.home?.score,
            score_away: match?.away?.score,
            side: 'home'
          }, match?.current_stage?.name === 'first_stage' ? 0 : 1, 'groups', match?.round.order - 1, true))
        }
      }
      // for (const match of res?.matches) {
      //     console.log(res.matches)
      //     this.store.dispatch(new QualifyWinner(this.selectedBracketMatchType, match, match?.current_stage?.name === 'first_stage' ? 0 : 1, 'groups', match?.round?.order - 1))
      // }

    })

  }

  changeGroup(index) {
    this.selectedGroupIndex = index
    if (this.bracketType === BRACKET_TYPES.FREE_FOR_ALL) {
      this.groupsParticipants = this.stages[this.selectedStage]?.groups[this.selectedGroupIndex]?.matches[this.selectedMatchIndex]?.participants

    }
    if (this.bracketType === BRACKET_TYPES.GROUP_STAGE) {
      this.groupsParticipants = this.stages[this.selectedStage]?.groups[this.selectedGroupIndex]?.participants
    }
  }

  checkBracket() {
    if (this.bracketType === BRACKET_TYPES.DOUBLE_ELIMINATION || this.bracketType === BRACKET_TYPES.SINGLE_ELIMINATION) {
      this.roundsTitle = this.stages[this.selectedStage]?.groups.map((round) => {
        return {order: round.order, name: round.name}
      })
      this.changeRoundFormat(this.stages[this.selectedStage]?.groups)

    } else {
      this.changeGroup(0)
    }
  }

  changeRoundFormat(rounds) {
    if (this.bracketType === BRACKET_TYPES.DOUBLE_ELIMINATION) {
      if (rounds) {
        rounds.upper = rounds.map((round) => {
          return round.winners_matches
        })
        rounds.lower = rounds.map((round) => {
          return round.losers_matches
        })
        this.matches = {
          upper: rounds.upper.flat(1),
          lower: rounds.lower.flat(1)
        }

      }
    } else {
      this.rounds = this.stages[this.selectedStage]?.groups.map((round) => {
        return {...round, is_hidden: false};
      })
      const matches = this.rounds.map((round) => {
        return round.matches
      })
      this.matches = matches.flat(1)
      console.log('here')

    }
    this.splitMatches(this.selectedTitle)

  }

  splitMatches(order) {
    this.rounds = this.rounds.map((obj) => {
      if (obj.order < order) {
        return {...obj, is_hidden: true};
      }
      return {...obj, is_hidden: false};
    });
    const filteredArray = this.rounds.filter(obj => obj.is_hidden === false);
    const matches = filteredArray.map((round) => {
      return round.matches
    })
    this.matches = matches.flat(1)

  }


  selectStage(stage) {
    this.selectedStage = stage;
    this.selectedMatchIndex = 0
    this.selectedGroupIndex = 0
    this.store.dispatch(new GetMatches(this.tournamentService.tournamentCode, this.selectedStage))
    this.bracketType = this.stages[this.selectedStage]?.type
    this.actions$.pipe(ofActionSuccessful(GetMatches)).subscribe(action => {
      this.bracketType = this.stages[this.selectedStage]?.type
      // this.bracketType = this.stages[this.selectedStage]?.type
    })
    this.checkBracket()

    this.getSelectedFreeForAllGroupsMatches()
  }

  getSelectedFreeForAllGroupsMatches(): any {
    if (this.bracketType === BRACKET_TYPES.FREE_FOR_ALL) {
      if (this.selectedMatchIndex === 'final') {
        this.groupsParticipants = this.stages[this.selectedStage]?.groups[this.selectedGroupIndex]?.participants
      } else {
        this.groupsParticipants = this.stages[this.selectedStage]?.groups[this.selectedGroupIndex]?.matches[this.selectedMatchIndex]?.participants

      }
    }
    if (this.bracketType === BRACKET_TYPES.GROUP_STAGE) {
      this.groupsParticipants = this.stages[this.selectedStage]?.groups[this.selectedGroupIndex]?.participants
    }
  }

  fullscreenToggle() {
    const element = document.getElementById('fullscreen-container');
    if (!this.isFullScreenEnabled) {
      // fullscreen
      if (element.requestFullscreen) {
        element.style.width = 100 + '%';
        element.style.height = 100 + '%';
        element.style.cursor = 'move';
        element.requestFullscreen();
        this.isFullScreenEnabled = true;
      } else if (element['webkitRequestFullscreen']) {
        element.style.width = 100 + '%';
        element.style.height = 100 + '%';
        element.style.cursor = 'move';
        element['webkitRequestFullscreen']();
        this.isFullScreenEnabled = true;
      }
    } else {
      // exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.isFullScreenEnabled = false;
      } else if (document['webkitExitFullscreen']) {
        document['webkitExitFullscreen']();
        this.isFullScreenEnabled = false;
      }
    }
  }
  ZoomIn() {
    this.zoom += 0.1;
    this.scaleX -= 60;
    this.scaleY += 60;
  }

  ZoomOut() {
    this.zoom -= 0.1;
    this.scaleX += 60;
    this.scaleY -= 60;
  }
  Reset() {
    this.zoom = 1;
    this.scaleX = 0;
    this.scaleY = 0;
  }
  setScale() {
    if (this.isFullScreenEnabled) {
      // Adjusting height of minimum 25 em and width of minimum 45%
      // scale zoom in up to 2.2
      // zoom out upt to 0.2
      // const tempHeight = this.zoom <= 1 ? 50 + (((1 - this.zoom) * 10) * 10) : 50 - (((this.zoom - 1) * 10) * 5);
      // const height = tempHeight < 25 ? 25 : tempHeight;
      let width = 100 + (1 - this.zoom) * 100;
      width = width < 45 ? 45 : width;
      return {
        width: 'calc(' + width + '%)',
        // 'height': 'calc(' + height + 'em)',
        height: '100%',
        transform: 'scale(' + this.zoom + ')'
      };
    } else {
      // const tempZoom = this.zoom <= 1 ? 100 + (((1 - this.zoom) * 30) * 10) : 100 - (((this.zoom - 1) * 10) * 10);
      return {
        // translate(' + this.scaleX + 'px,' + this.scaleY + 'px)
        // translate(799.2262792968746,82.51555786132829)scale(0.4399999999999998)
        width: 'calc(100% + (( 1% - ' + this.zoom + '% ) * 100))',
        // 'height': 'calc(' + tempZoom + 'vh)',
        height: '100%',
        transform: 'scale(' + this.zoom + ')'
      };
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
