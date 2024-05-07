import {State, Action, StateContext, Selector, createSelector, Store} from '@ngxs/store'
import {
  GetBanners,
  GetChallenges, GetFeaturedGames, GetPremiumPlayable, GetStoreProducts,
  GetTournaments,
} from './home.action'
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router'
import {HomeService} from "../service/home.service";
import {Tournament} from "../../../shared/models/tournament";
import {Challenge} from "../../../shared/models/challenge";
import {Game} from "../../../shared/models/game";
import {Arena} from "../../../shared/models/arena";

export class HomeStateModel {
  tournaments: Tournament[];
  challenges: Challenge[];
  featuredGames: Game[];
  featuredArenas: Arena[];
  banners: any[];
  playable: any[];
  storeProducts: any[];
}

@State<HomeStateModel>({
  name: 'home',
  defaults: {
    tournaments: [],
    challenges: [],
    featuredGames: [],
    featuredArenas: [],
    banners: [],
    playable: [],
    storeProducts: []
  }
})

@Injectable()
export class HomeState {

  constructor(private homeService: HomeService, private router: Router, private store: Store, private activatedRoute: ActivatedRoute) {

  }

  @Selector()
  static getTournaments(state: HomeStateModel) {
    return state.tournaments;
  }


  @Selector()
  static getChallenges(state: HomeStateModel) {
    return state.challenges;
  }

  @Selector()
  static getFeaturedGames(state: HomeStateModel) {
    return state.featuredGames;
  }

  @Selector()
  static getBanners(state: HomeStateModel) {
    return state.banners;
  }
  @Selector()
  static getPremiumPlayable(state: HomeStateModel) {
    return state.playable;
  }
  @Selector()
  static getStoreProducts(state: HomeStateModel) {
    return state.storeProducts;
  }


  @Action(GetTournaments)
  getTournaments({getState, setState, patchState}: StateContext<HomeStateModel>, payload: any) {
    return this.homeService.getTournaments(payload.page , payload.status , payload.per_page , payload.collection).pipe(tap((result) => {
      setState({
        ...getState(),
        tournaments: result,
      });
    }));
  }

  @Action(GetBanners)
  getBanners({getState, setState, patchState}: StateContext<HomeStateModel>) {
    return this.homeService.getBanners().pipe(tap((result) => {
      console.log(result)
      setState({
        ...getState(),
        banners: result,
      });
    }));
  }

  @Action(GetChallenges)
  getChallenges({getState, setState, patchState}: StateContext<HomeStateModel>, payload: any) {
    return this.homeService.getChallenges(payload.page , 8 , ['Open' , 'Live']).pipe(tap((result) => {
      setState({
        ...getState(),
        challenges: result.data,
      });
    }));
  }

  @Action(GetFeaturedGames)
  getGames({getState, setState}: StateContext<HomeStateModel>) {
    return this.homeService.getTrendingGames().pipe(tap((result) => {
      setState({
        ...getState(),
        featuredGames: result,
      });
    }));
  }
  @Action(GetPremiumPlayable)
  getPremiumPlayable({getState, setState}: StateContext<HomeStateModel>) {
    return this.homeService.getPremiumPlayables(true).pipe(tap((result) => {
      setState({
        ...getState(),
        playable: result,
      });
    }));
  }

  @Action(GetStoreProducts)
  getStoreProducts({getState, setState, patchState}: StateContext<HomeStateModel>, payload: any) {
    return this.homeService.getStoreProdcucts().pipe(tap((result) => {
      setState({
        ...getState(),
        storeProducts: result,
      });
    }));
  }


}




