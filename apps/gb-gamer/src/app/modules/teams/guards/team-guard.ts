import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {TeamsService} from "../service/teams.service";
import {Store} from "@ngxs/store";
import {SetNotifications} from "../../../shared/state/global.action";

@Injectable()
export class TeamGuard  {

  constructor(private store:Store , private router: Router, private teamService: TeamsService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.teamService.getTeamAuth(state.url.split('/')[2]).pipe(map((res:any) => {
      if (!res.authority.includes('Owner')) {
        this.router.navigateByUrl('/teams/' + state.url.split('/')[2]);
        this.store.dispatch(new SetNotifications('Owner access only !', 'Access Denied', 'error'))
        return false;
      } else {
        return true;
      }
    }, () => {
      this.router.navigateByUrl('/teams/' + state.url.split('/')[2]);
      return false
    }));

  }
}
