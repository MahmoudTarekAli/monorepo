import {Component, OnInit} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {SectionComponent} from "../../../../components/section/section.component";
import {GameCardComponent} from "../../../../shared/components/game-card/game-card.component";
import {TournamentCardComponent} from "../../../../shared/components/tournament-card/tournament-card.component";
import {CustomArenaService} from "../services/custom-arena.service";
import {Tournament} from "../../../../shared/models/tournament";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ButtonComponent} from "../../../../components/button/button.component";
import {ArenaService} from "../../service/arena.service";
import {FollowUnFollowArena, GetArena, GetArenasList} from "../../state/arenas.action";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {Observable} from "rxjs";
import {LoadingIndicatorComponent} from "../../../../shared/components/loading-indicator/loading-indicator.component";
import {GetCustomArenaGames, GetCustomArenaTournaments} from "../state/custom-arenas.action";
import {ArenasState} from "../../state/arenas.state";
import {Arena} from "../../../../shared/models/arena";
import {CustomArenasState} from "../state/custom-arenas.state";
import {NzModalService} from "ng-zorro-antd/modal";
import {RequiredInputsComponent} from "../../../../shared/modals/required-inputs/required-inputs.component";
import {FaqComponent} from "./modals/faq/faq.component";

@Component({
  selector: 'app-etisalat-arena',
  templateUrl: './etisalat-arena.component.html',
  styleUrls: ['./etisalat-arena.component.scss'],
  imports: [
    NgIf,
    SectionComponent,
    GameCardComponent,
    NgForOf,
    AsyncPipe,
    TournamentCardComponent,
    RouterLink,
    NgClass,
    ButtonComponent,
    LoadingIndicatorComponent
  ],
  providers:[NzModalService],
  standalone: true
})

export class EtisalatArenaComponent implements OnInit {
  isMobileView: boolean;
  upcomingTournaments:any;
  pastTournaments:any;
  games:any;
  activeGame:string;
  @Select(hasActionsExecuting([GetArena])) getArenaIsExecuting$: Observable<Boolean>;
  @Select(CustomArenasState.getArenaTournaments) arenaTournaments$: Observable<any>;
  @Select(CustomArenasState.getCustomArenaGames) arenaGames$: Observable<any>;
  @Select(ArenasState.getArena) Arena$: Observable<any>;


  constructor(private store: Store , private customArenaService:CustomArenaService , private router:Router, private modalService: NzModalService,
              private arenaService:ArenaService, private activatedRoute:ActivatedRoute) {

  }

  ngOnInit() {
    this.store.select((state: { setting: any; }) => state.setting).subscribe(data => {
      const state = data.setting
      this.isMobileView = state.isMobileView;
      console.log(this.isMobileView)
    });
    this.activatedRoute.queryParams.subscribe((params:any) => {
      console.log(params)
      if (params?.game) {
        this.activeGame = params.game
      } else {
        this.activeGame = ''
      }
    })
    this.store.dispatch(new GetArena('etisalat-gaming-eg'))
      this.getUpcomingTournaments(this.activeGame)
      this.getPastTournaments(this.activeGame)
      this.store.dispatch(new GetCustomArenaGames('etisalat-gaming-eg'))

  }


  getUpcomingTournaments(gameId?:string){
    this.store.dispatch(new GetCustomArenaTournaments('etisalat-gaming-eg' , ["Closed", "Open"]  , gameId , 'upcoming'))

  }
  getPastTournaments(gameId?:string){
      this.store.dispatch(new GetCustomArenaTournaments('etisalat-gaming-eg' , ['Finished', 'Cancelled', 'Live'] , gameId  , 'past'))
  }

  setActiveGame(code:string){
    this.activeGame = code;
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {game: code},
        queryParamsHandling: 'merge'
      });
    this.getUpcomingTournaments(code)
    this.getPastTournaments(code)

  }
  followUnfollowArena(code:string , type:string) {
    this.store.dispatch(new FollowUnFollowArena(code , type))
  }
  openFaqModal() {
    this.modalService.create({
      nzContent: FaqComponent,
      nzClassName: 'challenge-modal faq-modal',
      nzFooter: null,
      nzCentered: true,
      nzWidth: '600px',
    })
  }
}
