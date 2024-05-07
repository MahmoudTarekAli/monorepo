import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {fromEvent, Observable} from "rxjs";
import {ActionsExecuting, hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {ActivatedRoute, Router} from '@angular/router'
import {fadeInDownOnEnterAnimation, fadeOutUpOnLeaveAnimation} from "angular-animations";
import {debounceTime, distinctUntilChanged, map} from "rxjs/operators";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {json} from "express";
import {StatusColor} from "../../../core/match-status.enum";
import {SharedService} from "../../edit-tournament/service/shared.service";
import {TournamentProcessService} from "../../edit-tournament/tournament-process/services/tournament-process.service";
import {GetArenas, GetGames, GetOrganizedTournaments, GetTournaments} from "../../tournaments/state/tournament.action";
import {TournamentState} from "../../tournaments/state/tournament.state";
import {SharedModule} from "../../../shared/shared.module";
import {LoadingIndicatorModule} from "../../../shared/components/loading-indicator/loading-indicator.module";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NgOptimizedImage} from "@angular/common";


@Component({
  selector: 'app-my-tournaments',
  templateUrl: './my-tournaments.component.html',
  styleUrls: ['./my-tournaments.component.scss'],
  standalone: true,
  animations: [
    fadeInDownOnEnterAnimation({anchor: 'enter', duration: 800, translate: '30px'}),
    fadeOutUpOnLeaveAnimation({anchor: 'leave', duration: 400, translate: '30px'}),
  ],
  imports: [
    SharedModule,
    LoadingIndicatorModule,
    NzBadgeModule,
    ReactiveFormsModule,
    FormsModule,
    NzPopoverModule,
    NgOptimizedImage
  ]
})
export class MyTournamentsComponent implements OnInit, AfterViewInit {
  @Select(TournamentState.getTournamentList) tournaments: Observable<any>;
  @Select(hasActionsExecuting([GetTournaments])) getTournamentsIsExecuting$: Observable<ActionsExecuting>;
  @Select(hasActionsExecuting([GetOrganizedTournaments])) getOrganizedTournamentsIsExecuting$: Observable<ActionsExecuting>;
  @Select(TournamentState.getArenasList) getArenas$: Observable<any>;
  @Select(TournamentState.getGamesList) getGames$: Observable<any>;
  currentPage = 1;
  isPending: boolean
  @ViewChild('searchInput', {static: false}) search: ElementRef;
  marqueeStyle = {
    'font-size': ' 16px',
    padding: '10px',
    'white-space': 'nowrap',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'font-weight': 'normal',
    'text-transform': 'none'
  }
  statusColor: any = StatusColor
  arenas$: Observable<any>;
  user
  FiltersForm: UntypedFormGroup
  startAt = 'desc';
  createdAt;
  filterBadge = false
  sortBadge = false
  objectParam;
  searchText = ''
  constructor(private fb: UntypedFormBuilder, private store: Store, private sharedService: SharedService, private route: ActivatedRoute, private router: Router, private tournamentProcess: TournamentProcessService) {
    this.FiltersForm = this.fb.group({
      filters: [],
      participants_type : [null],
      arena_id: [''],
      game_code: [null],

    })
    this.route.queryParams.subscribe(param => {
      if (param?.name){
        this.searchText = param.name
      }
    })
  }

  ngOnInit() {
    this.store.dispatch(new GetArenas())
    this.store.dispatch(new GetGames())
    this.arenas$ = this.getArenas$.pipe(map(res => {
      return res.reverse()
    }))
    this.user = JSON.parse(localStorage.getItem('userAuth'))
    console.log(this.FiltersForm.value)

  }

  ngAfterViewInit() {
    fromEvent(this.search?.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(500)

      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.filterTournament()
    })
    if (this.objectParam?.name) {
      this.search.nativeElement.value = this.objectParam?.name

    }

  }


  filterTournament() {
    const QueryParams = {
      page: 1,
      name: this.search?.nativeElement?.value ? this.search?.nativeElement?.value : null,
    }
    this.tournamentProcess.removeEmptyKeys(QueryParams)
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: QueryParams,
        queryParamsHandling: 'merge'
      });

  }

  changeTournamentPage(page) {
    this.currentPage = page
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {page: this.currentPage},
        queryParamsHandling: 'merge'
      });
  }

  setTournamentCode(tournament) {
    this.sharedService.tournamentCode = tournament.code
  }
}
