import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {ManageTournamentService} from "../../services/manage-tournament.service";
import {SetStateActionNgxs} from "../../../../../store/setting_ngxs/actions";
import {Select, Store} from "@ngxs/store";
import {DOCUMENT} from "@angular/common";
import {ShuffleSingleBracket} from "../../state/manage-tournament.action";
import {BRACKET_TYPES} from "../../../../../core/tournament.enum";
import {takeUntil} from "rxjs/operators";
import {ManageTournamentState} from "../../state/manage-tournament.state";
import {Observable, Subject} from "rxjs";
import {Router} from "@angular/router";
import {TournamentProcessState} from "../../../tournament-process/state/tournament-process.state";
import {HandleError, SetNotifications} from "../../../../../shared/state/global.action";
import {PublishFirstStage} from "../../../tournament-process/state/tournament-process.action";

@Component({
  selector: 'app-publish-topbar',
  templateUrl: './publish-topbar.component.html',
  styleUrls: ['./publish-topbar.component.scss']
})
export class PublishTopbarComponent implements OnInit {
  isFullScreen: boolean;
  elem: any
  participants: any
  bracket: any
  bracketType: any
  tournament: any
  @Select(ManageTournamentState.getTournamentAllParticipants) getTournamentAllParticipants$: Observable<any>;
  @Select(ManageTournamentState.getTournamentBracket) getTournamentBracket$: Observable<any>;
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;

  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store, @Inject(DOCUMENT) private document: any, private router: Router, private manageTournamentService: ManageTournamentService) {
    const url = this.router.url;
    this.bracketType = Object.values(BRACKET_TYPES).find(type => url.includes(type));
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting;
      this.isFullScreen = state.isFullScreen;
    });
    this.getTournament.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data?.code) {
        this.tournament = data;
      }
    })
    this.getTournamentAllParticipants$.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      if (res.length > 0) {
        this.participants = res;
      }
      // you need this subscribe for getBrackets for publishing tournament
      this.getTournamentBracket$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
        if (data.length > 0) {
          this.bracket = data
        }
      })
    })

  }

  ngOnInit(): void {
  }

  // open and close fullscreen mode
  toggleFullscreen() {
    if (this.isFullScreen === true) {
      if (document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
      this.store.dispatch(
        new SetStateActionNgxs({
          isFullScreen: false,
        }),
      )

    } else {
      this.elem = document.getElementById('fullscreen-container');
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
      this.store.dispatch(
        new SetStateActionNgxs({
          isFullScreen: true,
        }),
      )
    }
  }

  shuffleBracket() {
    if (this.bracketType === BRACKET_TYPES.FREE_FOR_ALL || this.bracketType === BRACKET_TYPES.ROUND_ROBIN || this.bracketType === BRACKET_TYPES.GROUP_STAGE) {
      this.store.dispatch(new ShuffleSingleBracket(this.participants, this.bracketType, this.tournament?.tree?.data[0]?.group_settings?.no_of_participants_in_group));
    } else {
      this.store.dispatch(new ShuffleSingleBracket(this.participants, this.bracketType));
    }
  }

  publishBracket() {
    console.log(this.bracket)
    this.store.dispatch(new PublishFirstStage(this.tournament?.code, {bracket: this.bracket}));
  }

}
