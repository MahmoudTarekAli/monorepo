import {Component, Input, OnInit} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {Game} from "../../models/game";
import {RouterLink} from "@angular/router";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {FollowGame} from "../../../modules/games/state/games.action";
import {DefaultImagePipe} from "../../pipes/default-image.pipe";
import {AuthService} from "../../../modules/authentication/services/auth.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    NgIf,
    DefaultImagePipe,
    TranslateModule
  ],
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit{
  @Input() game: Game
  @Input() type: string
  @Input() isFavourite: boolean
  @Input() isHorizontal = false
  constructor(private store:Store , private authService:AuthService) {
  }
  ngOnInit() {
  }
  addToFavourite(gameId: string , isFollow:boolean) {
    this.authService.checkAuthority()
    this.store.dispatch(new FollowGame(gameId, isFollow))

  }

}
