import {State, Action, StateContext, Selector, createSelector, Store} from '@ngxs/store'
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router'
import {Tournament} from "../../../shared/models/tournament";
import {GetSearch, GetSearchFiltered, SetSearch} from "./search.action";
import {SearchService} from "../service/search.service";
import {User} from "../../authentication/models/user";
import {Arena} from "../../../shared/models/arena";
import {da_DK} from "ng-zorro-antd/i18n";

export class SearchStateModel {
  all: [];
  tournaments: Tournament[];
  filteredSearch: []
}

@State<SearchStateModel>({
  name: 'search',
  defaults: {
    all: [],
    tournaments: [],
    filteredSearch: []
  }
})

@Injectable()
export class SearchState {

  constructor(private searchService: SearchService, private router: Router, private store: Store, private activatedRoute: ActivatedRoute) {

  }

  @Selector()
  static search(state: SearchStateModel) {
    return state.all;
  }

  @Selector()
  static searchFiltered(state: SearchStateModel) {
    return state.filteredSearch;
  }

  @Action(GetSearch)
  search({getState, setState, patchState}: StateContext<SearchStateModel>, payload: GetSearch) {
    console.log(payload.word)
    return this.searchService.search(payload.word).pipe(tap((result) => {
      setState({
        ...getState(),
        all: result,
      });
    }));
  }


  @Action(GetSearchFiltered)
  searchFiltered({getState, setState, patchState}: StateContext<SearchStateModel>, payload: GetSearchFiltered) {
    return this.searchService.searchFiltered(payload.word, payload.api, payload.page).pipe(tap((result) => {
      setState({
        ...getState(),
        filteredSearch: result,
      });
    }));
  }


}




