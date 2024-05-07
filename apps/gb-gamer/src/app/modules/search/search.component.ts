import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {BehaviorSubject, Observable, skip, Subject, takeUntil} from "rxjs";
import {SearchState} from "./state/search.state";
import {GetSearch, GetSearchFiltered, SetSearch} from "./state/search.action";
import {ActivatedRoute, Router} from "@angular/router";
import {SetSearchKey} from "../../shared/state/global.action";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {GetTournaments} from "../home/state/home.action";
import {SearchService} from "./service/search.service";
import {da_DK} from "ng-zorro-antd/i18n";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Select(SearchState.search) search$: Observable<any[]>;
  @Select(hasActionsExecuting([GetSearch])) getSearchIsExecuting$: Observable<Boolean>;
  @Select(hasActionsExecuting([GetSearchFiltered])) getFilteredSearchIsExecuting$: Observable<Boolean>;

  @Select(SearchState.searchFiltered) searchFiltered$: Observable<any[]>;
  searchList: any
  selectedFilter = 'all'
  page = 1
  total: number
  isMobileView: boolean
  searchKey = ''
  searchFilteredList: any
  isLoading: boolean

  constructor(private store: Store, private activatedRoute: ActivatedRoute, private router: Router, private searchService: SearchService) {
    this.store.select((state: { setting: any; }) => state.setting).subscribe(data => {
      const state = data.setting
      this.isMobileView = state.isMobileView;
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['search_query']) {
        this.searchKey = params['search_query']
      }
      if (params['filter']) {
        this.selectedFilter = params['filter']
      } else {
        this.selectedFilter = 'all'
      }
      this.isLoading = true
      this.searchAction()
    });
  }


  ngOnInit() {
    this.getAllSearch()
  }

  getAllSearch() {
    this.searchService.search(this.searchKey).subscribe(data => {
      const search = Object.entries(data).map(([key, value]) => ({key, value, show: true, paginated: false}));
      this.searchList = search.filter((search: any) => search.key !== 'waiting_to_join_tournaments')
    })
  }

  searchAction() {
    this.searchNavigation()
    if (this.selectedFilter === 'all') {
      this.getAllSearch()
    } else {
      this.getSelectedFilter()
    }

  }

  getSelectedFilter() {
    this.searchService.searchFiltered(this.searchKey, this.selectedFilter, this.page).subscribe(data => {
      this.searchFilteredList = data
      this.isLoading = false
    })
  }

  selectFilter(filter: any) {
    this.page = 1
    this.selectedFilter = filter
    this.searchNavigation()
  }

  changePages(e: any) {
    this.page = e
    this.isLoading = true
    if (this.selectedFilter !== 'all') {
      this.searchNavigation()
      this.getSelectedFilter()
    }
  }


  searchNavigation() {
    this.router.navigateByUrl(`/search?filter=${this.selectedFilter}&search_query=${encodeURIComponent(this.searchKey)}&page=${this.page}`)

  }
}
