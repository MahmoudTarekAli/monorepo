import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {
  FollowUnFollowArena,
  GetArena, GetArenaEvents,
  GetChallengesArena,
  GetTournamentsArena
} from "../state/arenas.action";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {BannerCardComponent} from "../../../shared/components/banner-card/banner-card.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {CardListComponent} from "../../../shared/components/card-list/card-list.component";
import {Observable} from "rxjs";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {TournamentList} from "../../../shared/models/tournament";
import {ArenasState} from "../state/arenas.state";
import {Arena} from "../../../shared/models/arena";
import {AuthService} from "../../authentication/services/auth.service";
import {SectionComponent} from "../../../components/section/section.component";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {TranslateModule} from "@ngx-translate/core";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {FilterPopoverComponent} from "../../../shared/components/filter-popover/filter-popover.component";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {GetChallenges} from "../../home/state/home.action";
import {ChallengeList} from "../../../shared/models/challenge";
import {ViewRulesComponent} from "../../challenges/modal/view-rules/view-rules.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  ArenaActionsButtonsComponent
} from "../../../shared/modals/arena-actions-buttons/arena-actions-buttons.component";
import {EventCardComponent} from "../../../shared/components/event-card/event-card.component";

@Component({
  selector: 'app-arena-profile',
  standalone: true,
  imports: [CommonModule, BannerCardComponent, ButtonComponent, NzTabsModule, CardListComponent, RouterLink, SectionComponent, NzRadioModule, FormsModule, NzButtonModule, TranslateModule, NzPopoverModule, FilterPopoverComponent, LoadingIndicatorComponent, EventCardComponent],
  templateUrl: './arena-profile.component.html',
  styleUrls: ['./arena-profile.component.scss']
})
export class ArenaProfileComponent implements OnInit {
  @Select(ArenasState.getArena) Arena$: Observable<Arena>;
  @Select(ArenasState.getTournamentsArena) Tournaments$: Observable<TournamentList>;
  @Select(ArenasState.getArenaChallenges) challenges$: Observable<ChallengeList>;
  @Select(ArenasState.getArenaEvents) arenaEvents$: Observable<any>;
  @Select(hasActionsExecuting([GetTournamentsArena])) getTournamentArenaExecuting$: Observable<Boolean>;
  arenaSlug: string;
  status: string
  currentPage: number = 1
  isLoadChallenges: boolean = true
  totalChallengesPages: number
  currentChallengePage: number = 1
  ChallengeStatus: string | string[]

  constructor(private store: Store, private activatedRoute: ActivatedRoute, public authService: AuthService, private modalService: NzModalService,
              private actions$: Actions) {
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params: any) => {
      if (params.code) {
        this.arenaSlug = params.code
        this.store.dispatch(new GetArena(params.code))
        this.store.dispatch(new GetArenaEvents(this.arenaSlug))
        this.store.dispatch(new GetChallengesArena(this.arenaSlug, this.currentChallengePage, 12))
      }
    })
    this.arenaEvents$.subscribe(data => {
      console.log(data)
    })
    this.actions$.pipe(ofActionSuccessful(GetChallengesArena)).subscribe((data) => {
      this.isLoadChallenges = false
    })
    // this.store.dispatch(new GetChallengesArena(this.arenaSlug , this.currentChallengePage , 12))
    // this.challenges$.subscribe((data) => {
    //   if(data?.meta){
    //     this.totalChallengesPages = data.meta.total
    //   }
    // })
    this.changeTournamentPage(this.currentPage)
  }

  changeTournamentPage(page?: number, status?: string) {
    this.currentPage = page ?? this.currentPage
    this.status = status ?? this.status
    this.store.dispatch(new GetTournamentsArena(this.arenaSlug, this.currentPage, status))

  }


  changeChallengePage(page?: number, status?: string[]) {
    if (!this.isLoadChallenges && page < this.totalChallengesPages) {
      this.currentChallengePage = page ?? this.currentChallengePage
      this.ChallengeStatus = status
      this.store.dispatch(new GetChallengesArena(this.arenaSlug, this.currentChallengePage, 12, this.ChallengeStatus))
    }
  }

  followUnfollowArena(code: string, type: string) {
    this.authService.checkAuthority()
    this.store.dispatch(new FollowUnFollowArena(code, type))
  }

  openArenaActions(arena) {
    this.modalService.create({
      nzContent: ArenaActionsButtonsComponent,
      nzFooter: null,
      nzCentered: true,
      nzData: {arena: arena},

      nzWidth: '600px',
      nzClassName: 'challenge-modal'

    },)
  }
}
