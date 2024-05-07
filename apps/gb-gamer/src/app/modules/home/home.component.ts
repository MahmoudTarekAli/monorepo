import {Component, OnInit} from '@angular/core';
import {HomeService} from "./service/home.service";
import {Observable, Subject} from "rxjs";
import {Tournament} from "../../shared/models/tournament";
import {map} from "rxjs/operators";
import {Challenge} from "../../shared/models/challenge";
import {Game} from "../../shared/models/game";
import {
  GetBanners,
  GetChallenges,
  GetFeaturedGames,
  GetPremiumPlayable,
  GetStoreProducts,
  GetTournaments
} from "./state/home.action";
import {Select, Store} from "@ngxs/store";
import {HomeState} from "./state/home.state";
import {ActionsExecuting, hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {Arena} from "../../shared/models/arena";
import {ArenasState} from "../arena/state/arenas.state";
import {GetFeaturedArenas} from "../arena/state/arenas.action";
import {ActivatedRoute} from "@angular/router";
import {OwlOptions} from "ngx-owl-carousel-o";
import {environment} from "../../../environments/environment";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Select(HomeState.getTournaments) tournaments$: Observable<Tournament[]>;
  @Select(HomeState.getChallenges) challenges$: Observable<Challenge[]>;
  @Select(HomeState.getBanners) banners$: Observable<any[]>;
  @Select(HomeState.getPremiumPlayable) playable$: Observable<any[]>;
  @Select(HomeState.getFeaturedGames) trendingGames$: Observable<Game[]>;
  @Select(ArenasState.getFeaturedArenas) featuredArenas$: Observable<Arena[]>;
  @Select(HomeState.getStoreProducts) storeProducts$: Observable<any>;
  @Select(hasActionsExecuting([GetFeaturedGames])) getGamesIsExecuting$: Observable<Boolean>;
  @Select(hasActionsExecuting([GetTournaments])) getTournamentsIsExecuting$: Observable<Boolean>;
  @Select(hasActionsExecuting([GetChallenges])) getChallengesIsExecuting$: Observable<Boolean>;
  @Select(hasActionsExecuting([GetFeaturedArenas])) getArenasIsExecuting$: Observable<Boolean>;
  @Select(hasActionsExecuting([GetPremiumPlayable])) getPlayableIsExecuting$: Observable<Boolean>;
  @Select(hasActionsExecuting([GetStoreProducts])) getStoreProdutsIsExecuting$: Observable<Boolean>;
  isMobileView: boolean;
  public environment = environment;
  // sliderOptions: OwlOptions = {
  //   loop: true,
  //   mouseDrag: true,
  //   slideBy: 4,
  //   touchDrag: true,
  //   pullDrag: true,
  //   dots: false,
  //   autoplay: false,
  //   navSpeed: 400,
  //   nav:true ,
  //   navText: [' <img class="arrow-img" src="assets/svg-icons/next (2).png">', '<img class="arrow-img" src="assets/svg-icons/next (1).png">'],
  //   responsive: {
  //     0: {
  //       items: 1,
  //       stagePadding:40
  //
  //     },
  //     500: {
  //       items: 2,
  //       stagePadding:40
  //
  //     },
  //     740: {
  //       items: 2,
  //       stagePadding:10
  //
  //     },
  //     940: {
  //       items: 4,
  //       stagePadding:40
  //     }
  //   }
  // }

  constructor(private homeService: HomeService, private store: Store, private activatedRoute: ActivatedRoute) {

    this.store.select((state: { setting: any; }) => state.setting).subscribe(data => {
      const state = data.setting
      this.isMobileView = state.isMobileView;
      console.log(this.isMobileView)
    });}


  ngOnInit() {

    this.store.dispatch(new GetTournaments(1 ,'Open' , 8  , 'promoted'))
    this.store.dispatch(new GetBanners())
    this.store.dispatch(new GetChallenges(1 , 12))
    this.store.dispatch(new GetFeaturedGames(1))
    this.store.dispatch(new GetFeaturedArenas())
    this.store.dispatch(new GetPremiumPlayable())
    this.store.dispatch(new GetStoreProducts())
  }
}
