import {Component, importProvidersFrom, Input, OnInit} from '@angular/core';
import {NzButtonModule} from "ng-zorro-antd/button";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {Arena} from "../../models/arena";
import {Store} from "@ngxs/store";
import {FollowUnFollowArena} from "../../../modules/arena/state/arenas.action";
import {ArenasState} from "../../../modules/arena/state/arenas.state";
import {RouterLink} from "@angular/router";
import {AuthService} from "../../../modules/authentication/services/auth.service";
import {MarqueeComponent} from "../marquee/marquee.component";
import {TranslateModule} from "@ngx-translate/core";
import {FilterPipe} from "../../pipes/arena-router.pipe";

@Component({
  selector: 'app-arena-card',
  templateUrl: './arena-card.component.html',
  standalone: true,
  providers: [ArenasState],
  imports: [
    NzButtonModule,
    NgOptimizedImage,
    NgIf,
    RouterLink,
    NgClass,
    MarqueeComponent,
    FilterPipe,
    TranslateModule
  ],

  styleUrls: ['./arena-card.component.scss']
})
export class ArenaCardComponent implements OnInit {
  @Input() arena: Arena
  @Input() flexDirection =  'column'
  @Input() flexContentDirection =  'column'
  @Input() isChallenge:boolean
  @Input() isShowFollowButton = true
  @Input() typeOfFollowArena ;


  constructor(private store:Store , private authService:AuthService) {
  }
  ngOnInit() {
  }
  followUnfollowArena(type:string) {
    this.authService.checkAuthority()
    this.store.dispatch(new FollowUnFollowArena(this.arena.slug,type))
  }
}
