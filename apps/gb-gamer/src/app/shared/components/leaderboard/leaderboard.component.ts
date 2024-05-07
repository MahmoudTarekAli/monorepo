import {Component, Input, OnInit} from '@angular/core';
import {GlobalService} from "../../service/global.service";
import {NzTableModule} from "ng-zorro-antd/table";
import {Leaderboard, LeaderboardPoints} from "../../models/leaderboard";
import {TranslateModule} from "@ngx-translate/core";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {MarqueeComponent} from "../marquee/marquee.component";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NgForOf, NgIf} from "@angular/common";
import {CountryPipe} from "../../pipes/country.pipe";
import {LoadingIndicatorComponent} from "../loading-indicator/loading-indicator.component";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  imports: [
    NzTableModule,
    TranslateModule,
    NzAvatarModule,
    MarqueeComponent,
    NzPaginationModule,
    NzToolTipModule,
    NgIf,
    NgForOf,
    CountryPipe,
    LoadingIndicatorComponent
  ],
  standalone: true
})
export class LeaderboardComponent implements OnInit{
  @Input() leaderBoardType: string;
  @Input() leaderBoardCode: string;

  leaderBoard:LeaderboardPoints;
  displayedColumns: string[] = ['#' , 'username' , 'country' ,  'points'];
  loadingIndicator = false
  constructor(private globalService:GlobalService) { }

  ngOnInit(): void {
    this.globalService.getLeaderboards(this.leaderBoardType , this.leaderBoardCode ).subscribe(data => {
      this.globalService.getLeaderBoardPoints( data.data[0].id , 1).subscribe(res => {
        this.leaderBoard = res

      })
    })

  }

}
