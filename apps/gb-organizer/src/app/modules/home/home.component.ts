import {Component, DoCheck, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterLink, RouterOutlet} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {SharedModule} from "../../shared/shared.module";
import {Select, Store} from "@ngxs/store";
import {TournamentState} from "../tournaments/state/tournament.state";
import {Observable} from "rxjs";
import {ActionsExecuting, hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {GetOrganizedTournaments, GetTournaments} from "../tournaments/state/tournament.action";
import {StatusColor} from "../../core/match-status.enum";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormGroup} from "@angular/forms";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {GlobalService} from "../../shared/services/global.service";
import {GetChallengesGames, GetChallengesList} from "../challenges/state/challenges.action";
import {ChallengesState} from "../challenges/state/challenges.state";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    RouterOutlet,
    TranslateModule,
    RouterLink,
    NzBadgeModule,
    SharedModule,
    NzPopoverModule,
    FormsModule,
    ReactiveFormsModule
  ],
  standalone: true
})
export class HomeComponent implements OnInit{
  @Select(TournamentState.getTournamentList) tournaments: Observable<any>;
  @Select(hasActionsExecuting([GetTournaments])) getTournamentsIsExecuting$: Observable<ActionsExecuting>;
  @Select(hasActionsExecuting([GetOrganizedTournaments])) getOrganizedTournamentsIsExecuting$: Observable<ActionsExecuting>;
  @Select(TournamentState.getArenasList) getArenas$: Observable<any>;
  @Select(TournamentState.getGamesList) getGames$: Observable<any>;
  @Select(ChallengesState.getChallengeGames) ChallengeGames$: Observable<any>;
  currentPage = 1;
  isPending: boolean
  filterStatus = ''
  @ViewChild('searchInput', {static: false}) search: ElementRef;
  filters = [
    {name: 'All', value: null},
    {name: 'Open', value: 'Open'},
    {name: 'Finished', value: 'Finished'},
    {name: 'Closed', value: 'Closed'},
    {name: 'Live', value: 'Live'},
    {name: 'Cancelled', value: 'Cancelled'},
    {name: 'Unpublished', value: 'Unpublished'}
  ];
  challengesFilters = [
        {name: 'All', value: null},
        {name: 'Open', value: 'Open'},
        {name: 'Finished', value: 'Finished'},
        {name: 'Live', value: 'Live'},
      ];
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
  filtersButtonValue
  popoverFilterVisible = false;
  popoverSortVisible = false;
  user
  FiltersForm: FormGroup
  startAt = 'desc';
  createdAt;
  filterBadge = false
  sortBadge = false
  objectParam;
  type
  isMobileView = false
  searchText = ''
  constructor(private router: Router, private route: ActivatedRoute, private globalService: GlobalService , private fb: FormBuilder , private store: Store) {
    this.type = router.url.includes('my-tournaments') ? 'my-tournaments' : 'my-challenges'

    this.FiltersForm = fb.group({
      filters: [],
      participants_type : [null],
      arena_id: [''],
      game_code: [null],

    })
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.type = val.url.includes('my-tournaments') || val.urlAfterRedirects.includes('my-tournaments') ? 'my-tournaments' : 'my-challenges'
      }
    });

    this.route.queryParams.subscribe(param => {
      this.objectParam = param
      this.createdAt = param?.created_at
      this.startAt = param?.start_at;
      this.searchText = param?.name
      if (!this.startAt && !param.created_at) {
        this.startAt = 'desc'
      }
      if (this.startAt !== 'desc' || param.created_at) {
        this.sortBadge = true
      }
      if (Object.keys(param).length === 0) {
        console.log('here')
        this.getTournamentsChallenges(this.currentPage)
      }
      if (param.filters || param.participants_type  || param.arena_id || param.game_code) {
        this.FiltersForm.patchValue(param)
        this.filterBadge = true
        param.arena_id ? this.FiltersForm.controls.arena_id.setValue(Number(param.arena_id)) : this.FiltersForm.controls.arena_id.setValue('')
      }
      if (param.page) {
        this.currentPage = param?.page
        this.getTournamentsChallenges(this.currentPage)
      }

    })
  }
  ngOnInit() {
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting;
      this.isMobileView = state.isMobileView;
    });
  }



  filterTournament(page?, sort?) {
    if (sort === 'start_at') {
      this.createdAt = null
    } else if (sort === 'created_at') {
      this.startAt = null
    }
    this.popoverFilterVisible = false
    this.popoverSortVisible = false
    const QueryParams = {
      page: 1,
      filters: this.FiltersForm.value.filters,
      name: this.search?.nativeElement?.value ? this.search?.nativeElement?.value : null,
      participants_type : this.FiltersForm.value.participants_type ,
      arena_id: this.FiltersForm.value.arena_id,
      game_code: this.FiltersForm.value.game_code,
      start_at: this.createdAt ? null : this.startAt,
      created_at: this.createdAt
    }
    this.globalService.removeEmptyKeys(QueryParams)
    this.router.navigate(
      ['/' + this.type],
      {
        relativeTo: this.route,
        queryParams: QueryParams,
        // queryParamsHandling: 'merge'
      });

  }

  clearFilters(type) {
    if (type === 'filter') {
      this.FiltersForm.reset()
      this.popoverFilterVisible = false
      this.filterBadge = false
    } else if (type === 'sort') {
      this.startAt = 'desc'
      this.createdAt = null
      this.popoverSortVisible = false
      this.sortBadge = false

    }
    this.filterTournament()
  }
  getTournamentsChallenges(page?) {
    if (page) {
      this.currentPage = page
    }
    if (this.type === 'my-tournaments') {
      this.store.dispatch(new GetTournaments(page ? page : 1, this.searchText, this.FiltersForm.value.filters, this.FiltersForm.value.participants_type , this.FiltersForm.value.arena_id, this.FiltersForm.value.game_code, this.startAt, this.createdAt))
    }else{
      this.store.dispatch(new GetChallengesList(page ? page : 1 , this.FiltersForm.value.filters , this.FiltersForm.value.game_code ,  this.startAt, this.createdAt))
    }
  }

  changeType(type) {
    console.log(type)
    this.clearFilters('filter')
    this.clearFilters('sort')
    this.type = type
    // this.router.navigate([`/${type}`])
    this.getTournamentsChallenges()
  }

}
