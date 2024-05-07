import { Component, OnDestroy, OnInit } from '@angular/core'
import {Select, Store} from "@ngxs/store";
import {TournamentProcessState} from "../../tournament-process/state/tournament-process.state";
import {Observable, Subject} from "rxjs";
import {ManageTournamentService} from "../services/manage-tournament.service";
import {GetTournamentAllParticipants} from "../state/manage-tournament.action";
import {Router} from "@angular/router";
import { SharedService } from '../../service/shared.service'
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-publish-brackets',
  templateUrl: './publish-brackets.component.html',
  styleUrls: ['./publish-brackets.component.scss']
})
export class PublishBracketsComponent implements OnInit , OnDestroy {
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;
  isFullScreen: boolean;
  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(public manageTournamentService: ManageTournamentService, private store: Store, private router: Router , private sharedService: SharedService) {
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting;
      this.isFullScreen = state.isFullScreen;
      // console.log(this.isFullScreen)
    });
    this.getTournament.pipe(takeUntil(this.unsubscribe$)).subscribe(tournament => {
      console.log(tournament)
      if (tournament?.code) {
      }
    })
    this.store.dispatch(new GetTournamentAllParticipants(this.sharedService.tournamentCode))

  }

  ngOnInit(): void {
  }
  ngOnDestroy() {

  }

}
