import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {Select} from "@ngxs/store";
import {TournamentProcessState} from "../../tournament-process/state/tournament-process.state";
import {Observable} from "rxjs";

@Injectable()
export class PublishBracketGuard  {
  status: any;
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;

  constructor(private router: Router) {
  }

  handleGuard() {
    // prevent user from accessing the page if the bracket is published
    this.getTournament.subscribe(tournament => {
      console.log(tournament?.tree?.data[0]?.is_published)
      if (tournament?.tree?.data[0]?.is_published === 1) {
        // return this.router.navigate([`tournament/${tournament.code}/process/tournament-progress`]);
        return false;
      } else {
        console.log(tournament?.tree?.data[0]?.is_published)

        return true;
      }
    });
    return true;
  }

  canActivate() {
    return this.handleGuard();
  }
}
