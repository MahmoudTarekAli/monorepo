import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable, Pipe } from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Store} from "@ngxs/store";
import {ArenaService} from "../service/arena.service";
import {HandleError} from "../../../shared/state/global.action";

@Injectable()
export class ArenaGuard  {

  constructor(private router: Router, private store:Store , private arenaService: ArenaService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.arenaService.getArenaAuthority(state.url.split('/')[2]).pipe(map((res:any) => {
      this.arenaService.authority = res.Authority;
      if (res.Authority === 'None' || res.Authority === 'Moderator') {
        this.router.navigateByUrl('/arenas/' + state.url.split('/')[2]);
        this.store.dispatch(new HandleError('Access Denied Owner access only !'))
        return false;
      } else if (res.Authority === 'GBarenaAdmin') {
        return true;
      } else {
        return true;
      }
    }, () => {
      this.router.navigateByUrl('/arenas/' + state.url.split('/')[2]);
      return false
    }))


  }
}
