import {Component, ElementRef, ViewChild} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {EventState} from "../events/state/event.state";
import {Observable} from "rxjs";
import {Challenge} from "../../shared/models/challenge";
import {GetEventChallenge} from "../events/state/event.action";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {AuthService} from "../authentication/services/auth.service";

@Component({
  selector: 'app-riot-ramadan',
  templateUrl: './riot-ramadan.component.html',
  styleUrls: ['./riot-ramadan.component.scss']
})
export class RiotRamadanComponent {
  @Select(EventState.getEventChallenges) challenges$: Observable<Challenge[]>;
  @Select(hasActionsExecuting([GetEventChallenge])) getChallengesIsExecuting$: Observable<Boolean>;

  constructor(private store:Store, public router:Router , private activateRoute:ActivatedRoute, public authService: AuthService) {
    let activeGame = 'league-of-legends'
    this.activateRoute.queryParams.subscribe((param:any) => {
      if (param?.game){
        activeGame = param.game
      }
      this.store.dispatch(new GetEventChallenge('riot-ramadan-quests', activeGame))
    })

  }
  ngOnInit(){


  }


  protected readonly environment = environment;
}
