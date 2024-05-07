import {Component, OnInit} from '@angular/core';
import {CardListComponent} from "../../../shared/components/card-list/card-list.component";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {GamesState} from "../../games/state/games.state";
import {Observable, take} from "rxjs";
import {Game} from "../../../shared/models/game";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {GetGamesList} from "../../games/state/games.action";
import {ChallengesState} from "../state/challenges.state";
import {Challenge, ChallengeList} from "../../../shared/models/challenge";
import {GetChallengesList} from "../state/challenges.action";
import {AsyncPipe, NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {
  RadioButtonsFiltersComponent
} from "../../../shared/components/radio-buttons-filters/radio-buttons-filters.component";
import {AdBannerComponent} from "../../../shared/components/ad-banner/ad-banner.component";
import {SectionComponent} from "../../../components/section/section.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzButtonModule} from "ng-zorro-antd/button";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChallengesService} from "../service/challenges.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FilterPopoverComponent} from "../../../shared/components/filter-popover/filter-popover.component";

@Component({
  selector: 'app-challenges-list',
  templateUrl: './challenges-list.component.html',
  styleUrls: ['./challenges-list.component.scss'],
  imports: [
    CardListComponent,
    AsyncPipe,
    LoadingIndicatorComponent,
    RadioButtonsFiltersComponent,
    NgIf,
    AdBannerComponent,
    UpperCasePipe,
    SectionComponent,
    ButtonComponent,
    NzPopoverModule,
    NzRadioModule,
    NzButtonModule,
    TranslateModule,
    NgForOf,
    ReactiveFormsModule,
    FilterPopoverComponent,
    FormsModule
  ],
  standalone: true
})
export class ChallengesListComponent implements OnInit {
  @Select(ChallengesState.getAllChallenges) Challenges$: Observable<ChallengeList>;
  @Select(hasActionsExecuting([GetChallengesList])) getChallengeIsExecuting: Observable<Boolean>;
  filters = [
    {name: 'Active', value: 'active'},
    {name: 'Upcoming', value: 'inactive'},
    {name: 'Finished', value: 'finished'},
  ];
  challengesGames: any[];
  gameCode: string = ''
  filterBadge: boolean = false;
  popoverFilterVisible: boolean = false;
  bannerImages
  challengeStatus
  constructor(private fb: FormBuilder, private store: Store, private actions$: Actions, public translate: TranslateService,
              private challengeService: ChallengesService, private activatedRoute: ActivatedRoute, private router:Router) {


  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      console.log(params)
      if (params?.game){
        this.gameCode = params?.game

      }
      this.store.dispatch(new GetChallengesList(1 , null , this.gameCode))

    })
    this.challengeService.getChallengesGame().subscribe((res: any) => {
      this.challengesGames = res
      this.challengesGames.forEach((item: any) => {
        item.value = item.code
      })
      this.challengesGames.unshift({name: 'All', value: ''})
    })
    this.bannerImages = {
      '': 'assets/images/challenges/main-challenge-banner.webp',
      'league-of-legends': 'assets/riot-ramadan/lol-banner.webp',
      'valorant': 'assets/riot-ramadan/valorant-banner.webp'
    }
    this.actions$.pipe(take(1), ofActionSuccessful(GetChallengesList)).subscribe(() => {
      this.router.navigate([], {
        queryParams: {
          game: this.gameCode
        },
        queryParamsHandling: 'merge',
      });

    })
  }

  filterChallenge(event) {
    this.challengeStatus = event
    this.store.dispatch(new GetChallengesList(1, event , this.gameCode))
  }

  changeChallengePage(page: number) {
    this.store.dispatch(new GetChallengesList(page, this.challengeStatus, this.gameCode))
  }

  filterByGame(gameCode: any) {
    this.gameCode = gameCode
      this.router.navigate([], {
        queryParams: {
          game: gameCode ? gameCode : null
        },
        queryParamsHandling: 'merge',
      });
  }
}
