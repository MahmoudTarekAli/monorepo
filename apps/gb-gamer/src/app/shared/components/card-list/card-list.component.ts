import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tournament, TournamentList} from "../../models/tournament";
import {TournamentCardComponent} from "../tournament-card/tournament-card.component";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {GameCardComponent} from "../game-card/game-card.component";
import {ChallengeCardComponent} from "../gb-card/challenge-card.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  imports: [
    TournamentCardComponent,
    NgForOf,
    NzPaginationModule,
    GameCardComponent,
    NgIf,
    ChallengeCardComponent,
    RouterLink,
    NgClass,
    NgStyle,
  ],
  standalone: true
})
export class CardListComponent implements OnInit{
  @Input() cards:any | null
  @Input() page:number;
  @Input() total:number | undefined;
  @Input() cardType:string;
  @Input() isPaginated:boolean;
  @Output() changePage = new EventEmitter();
  @Input() pageSize = 20
  @Input() flexWrap = true
  @Input() isFeatured = true
  @Input() challengeQueryParam = ''
  constructor() {
  }
  ngOnInit() {
  }
  changePages(event: any) {
    console.log(event)
    this.page = event
    this.changePage.emit(event)
  }
}
