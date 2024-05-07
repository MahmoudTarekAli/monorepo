import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {Select} from "@ngxs/store";
import {TournamentProcessState} from "../state/tournament-process.state";
import {Observable} from "rxjs";

@Injectable()
export class CanActivateViaBracketGuard  {
  treeLength: any;
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;

  constructor(private router: Router) {
  }

  handleGuard() {
    this.getTournament.subscribe(tournament => {
      this.treeLength = tournament?.tree?.data?.length
      if (this.router.url.includes('second_stage') && this.treeLength === 0) {
        this.router.navigateByUrl(this.router.url.replace('second_stage', 'first_stage'))
      }
    })
    return true;
  }

  canActivate() {
    return this.handleGuard();
  }
}
