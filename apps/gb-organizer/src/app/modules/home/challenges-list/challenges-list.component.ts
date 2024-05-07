import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../../shared/shared.module";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {Select, Store} from "@ngxs/store";
import {GetChallenge, GetChallengesGames, GetChallengesList} from "../../challenges/state/challenges.action";
import {Observable} from "rxjs";
import {ChallengesState} from "../../challenges/state/challenges.state";
import {Router} from "@angular/router";
import {ChallengesService} from "../../challenges/service/challenges.service";
import {environment} from "../../../../environments/environment";


@Component({
  selector: 'app-challenges-list',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './challenges-list.component.html',
  styleUrls: ['./challenges-list.component.scss']
})
export class ChallengesListComponent implements OnInit{
  @Select(ChallengesState.getChallengesList) Challenges$: Observable<any>;
  environment = environment;
  displayedColumns: string[] = [ 'name', 'game' , 'start_at' , 'end_date' , 'type' , 'status'  , 'actions'];
  constructor(private store: Store , private router: Router , private challengeService: ChallengesService) {
  }
  ngOnInit(): void {
    this.store.dispatch(new GetChallengesGames())

  }
  changePage(page){
    this.store.dispatch(new GetChallengesList(page))
  }
  duplicateChallenge(code) {
    this.challengeService.dublicateChallengeCode = code
    this.router.navigate(['/challenges/create'])
    this.store.dispatch(new GetChallenge(code))
  }
}
