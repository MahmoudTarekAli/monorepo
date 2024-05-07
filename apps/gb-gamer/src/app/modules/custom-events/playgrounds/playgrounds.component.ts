import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzDividerModule} from "ng-zorro-antd/divider";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {TournamentCardComponent} from "../../../shared/components/tournament-card/tournament-card.component";
import {ChallengeCardComponent} from "../../../shared/components/gb-card/challenge-card.component";
import {GamerService} from "../../gamer/service/gamer.service";
import {GetEvent} from "../../events/state/event.action";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../authentication/services/auth.service";

@Component({
  selector: 'app-playgrounds',
  standalone: true,
    imports: [CommonModule, NzDividerModule, TournamentCardComponent, ChallengeCardComponent, RouterOutlet],
  templateUrl: './playgrounds.component.html',
  styleUrls: ['./playgrounds.component.scss']
})
export class PlaygroundsComponent {
  hasAccount = false
  environment: any = environment;

  constructor(private gamerService:GamerService , private router:Router , private authService:AuthService) {
}
  ngOnInit() {
    if (this.authService.getToken()){
    this.gamerService.getSocialAccounts().subscribe(res => {
      if (res.some( acc => acc?.driver === 'riot')){
        console.log('here')
        this.hasAccount = true
      }
    })
    }

  }
  linkRiotAccount() {
    sessionStorage.setItem('source', this.router.url)
    window.location.href = `${environment?.auth_apiUrl}/auth/riot`
  }
}
