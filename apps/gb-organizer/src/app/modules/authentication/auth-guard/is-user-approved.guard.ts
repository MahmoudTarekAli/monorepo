import {Injectable} from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import {AuthService} from '../services/auth.service';
import {SharedService} from "../../edit-tournament/service/shared.service";
import {map} from "rxjs/operators";
import {Select} from "@ngxs/store";
import {TournamentProcessState} from "../../edit-tournament/tournament-process/state/tournament-process.state";
import {Observable} from "rxjs";

@Injectable()
export class CanActivateUserAuthority  {
  status: any;
  tournamentCode
  @Select(TournamentProcessState.getAuthority) getAuthority$: Observable<any>;

  constructor(private authService: AuthService, private router: Router, private sharedService: SharedService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    console.log(state.url.split('tournament/').pop().split('/')[0])
    this.tournamentCode = state.url.split('tournament/').pop().split('/')[0]
    // get tournament code from url
    if (this.sharedService.authorityType) {
      if (this.sharedService.authorityType !== 'Moderator' || this.sharedService.authorityType !== 'None') {
        return true
      } else {
        this.router.navigateByUrl(`tournament/${this.tournamentCode}/process/tournament-progress`);
        return false
      }
    } else {
      return this.sharedService.checkAuthority(this.tournamentCode).pipe(map(res => {
        console.log(res)
        if (res.Authority !== 'Moderator' || res.Authority !== 'None') {
          return true
        }
        this.router.navigateByUrl(`tournament/${this.tournamentCode}/process/tournament-progress`);
        return false
      }))
    }

  }
}
