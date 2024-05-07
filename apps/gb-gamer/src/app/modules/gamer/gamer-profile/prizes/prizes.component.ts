import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {GamerState} from "../../state/gamer.state";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {GamerService} from "../../service/gamer.service";
import {GetUserClaims} from "../../state/gamer.action";
import {MatchBarComponent} from "../../../../shared/components/match-bar/match-bar.component";
import {GbBarComponent} from "../../../../shared/components/gb-bar/gb-bar.component";
import {GlobalState} from "../../../../shared/state/global.state";
import {PlaceHolderComponent} from "../../../../shared/components/place-holder/place-holder.component";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {LoadingIndicatorComponent} from "../../../../shared/components/loading-indicator/loading-indicator.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-prizes',
  standalone: true,
  imports: [CommonModule, MatchBarComponent, GbBarComponent, PlaceHolderComponent, NzPaginationModule, LoadingIndicatorComponent, TranslateModule],
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.scss']
})
export class PrizesComponent implements OnInit{
  @Select(GamerState.getClaims) claims$: Observable<any>;
  @Select(GlobalState.getCoins) coins$: Observable<number>;
  isLoading: boolean = true
  constructor(private store:Store , private actions$:Actions) {}
  ngOnInit() {
    this.store.dispatch(new GetUserClaims(1))
    this.actions$.pipe(ofActionSuccessful(GetUserClaims)).subscribe((data) => {
      this.isLoading = false
    })
  }
  changePage(page: number) {
    this.store.dispatch(new GetUserClaims(page))
  }
}
