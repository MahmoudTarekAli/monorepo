import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GetEventTournaments} from "../../../events/state/event.action";
import {Store} from "@ngxs/store";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {TranslateModule} from "@ngx-translate/core";
import {GlobalService} from "../../../../shared/service/global.service";

@Component({
  selector: 'app-playground-game',
  standalone: true,
  imports: [CommonModule, NzDividerModule, RouterLink, RouterLinkActive, RouterOutlet, TranslateModule],
  templateUrl: './playground-game.component.html',
  styleUrls: ['./playground-game.component.scss']
})
export class PlaygroundGameComponent {
  selectedGame: any = null
  gamesDescription = ''
  constructor(private store:Store, private activatedRoute: ActivatedRoute, public router: Router , private globalService:GlobalService) {
    this.activatedRoute.params.subscribe((params: any) => {
      console.log(params)
      if (params?.game) {
        this.selectedGame = params?.game
        this.globalService.selectedGame = params?.game
      }
      this.store.dispatch(new GetEventTournaments('playgrounds-season-3', null, 1, this.selectedGame))
      if (this.selectedGame === 'valorant'){
        this.gamesDescription = 'playgrounds_valorant_desc'
      } else if(this.selectedGame === 'league-of-legends'){
        this.gamesDescription = 'playgrounds_league_desc'
      } else if (this.selectedGame === 'wild-rift'){
        this.gamesDescription = 'playgrounds_wildrift_desc'
      }
    })
  }
}
