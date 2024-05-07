import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {GetJoinedChallenges, GetJoinedTournaments, GetUpcomingMatches} from "../../state/gamer.action";
import {GamerService} from "../../service/gamer.service";
import {GamerState} from "../../state/gamer.state";
import {debounceTime, distinctUntilChanged, filter, fromEvent, merge, Observable} from "rxjs";
import {GbBarComponent} from "../../../../shared/components/gb-bar/gb-bar.component";
import {LoadingIndicatorComponent} from "../../../../shared/components/loading-indicator/loading-indicator.component";
import {MatchBarComponent} from "../../../../shared/components/match-bar/match-bar.component";
import {MarqueeComponent} from "../../../../shared/components/marquee/marquee.component";
import {PlaceHolderComponent} from "../../../../shared/components/place-holder/place-holder.component";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {FilterPopoverComponent} from "../../../../shared/components/filter-popover/filter-popover.component";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzIconModule} from "ng-zorro-antd/icon";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-esports',
  templateUrl: './esports.component.html',
  styleUrls: ['./esports.component.scss'],
  imports: [
    NzTabsModule,
    NgForOf,
    TranslateModule,
    RouterModule,
    NgIf,
    AsyncPipe,
    GbBarComponent,
    LoadingIndicatorComponent,
    MatchBarComponent,
    MarqueeComponent,
    PlaceHolderComponent,
    NzPaginationModule,
    FilterPopoverComponent,
    NzInputModule,
    NzIconModule
  ],
  standalone: true

})
export class EsportsComponent implements OnInit {
  @Select(GamerState.getJoinedTournaments) joinedTournaments$: Observable<any>;
  @Select(GamerState.getJoinedChallenges) joinedChallenges$: Observable<any>;
  @Select(GamerState.getUpcomingMatches) upcomingMatches$: Observable<[]>;
  loadingChallenge = true
  loadingMatches = true
  loadingTournaments = true
  currentChallengePage
  ChallengeStatus
  currentPage
  status
  tabStatus  = ''
  @ViewChild('searchInput', {static: false}) searchInput: ElementRef;
  @ViewChild('challengeSearchInput', {static: false}) challengeSearchInput: ElementRef;

  constructor(private store: Store, private gamerService: GamerService, private actions$: Actions , private activateRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.store.dispatch(new GetJoinedTournaments(this.gamerService.slug, 1))
    this.store.dispatch(new GetUpcomingMatches(this.gamerService.slug))
    this.store.dispatch(new GetJoinedChallenges(this.gamerService.slug))
    this.actions$.pipe(ofActionSuccessful(GetJoinedChallenges)).subscribe((res: any) => {
      this.loadingChallenge = false
    })
    this.actions$.pipe(ofActionSuccessful(GetUpcomingMatches)).subscribe((res: any) => {
      this.loadingMatches = false
    })
    this.actions$.pipe(ofActionSuccessful(GetJoinedTournaments)).subscribe((res: any) => {
      this.loadingTournaments = false
    })
    this.activateRoute.queryParams.subscribe((params:any) => {
      console.log(params)
      this.tabStatus = params?.['tab'] ? params.tab : 'tournaments'
    })
  }

  ngAfterViewInit() {
    const searchInput = this.searchInput?.nativeElement;
    const challengeSearchInput = this.challengeSearchInput?.nativeElement;
    const keyupEvents = merge(
      searchInput ? fromEvent(searchInput, 'keyup') : [],
      challengeSearchInput ? fromEvent(challengeSearchInput, 'keyup') : []
    );

    keyupEvents.pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 0)
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      console.log(text)
      if (this.tabStatus === 'tournaments'){
        this.filterTournaments(1, this.status, text)
      }else {
        this.filterChallenges(1, this.ChallengeStatus, text)

      }

    });
  }

  filterChallenges(page: number, status?, search?) {
    this.currentChallengePage = page ?? this.currentChallengePage
    this.ChallengeStatus = status ?? this.ChallengeStatus
    this.store.dispatch(new GetJoinedChallenges(this.gamerService.slug, page, this.ChallengeStatus , search))
  }

  filterTournaments(page: number, status?, search?) {
    console.log(search)
    this.currentPage = page ?? this.currentPage
    this.status = status ?? this.status
    this.store.dispatch(new GetJoinedTournaments(this.gamerService.slug, page, this.status, search))
  }
  filterMatches(page: number, status?) {
    this.currentPage = page ?? this.currentPage
    this.status = status ?? this.status
    console.log(this.status ,)
    this.store.dispatch(new GetUpcomingMatches(this.gamerService.slug, page, this.status))
  }
}
