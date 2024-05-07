import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Observable} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';
import {map} from 'rxjs/operators';
import {SharedService} from "../../edit-tournament/service/shared.service";
import {NzNotificationComponent, NzNotificationService} from "ng-zorro-antd/notification";
import {Select, Store} from "@ngxs/store";
import {GetUserAuthority} from "../../edit-tournament/tournament-process/state/tournament-process.action";
import {TournamentProcessState} from "../../edit-tournament/tournament-process/state/tournament-process.state";

@Injectable()
export class OrganizerGuard  {

  constructor(
              private notify: NzNotificationService,
              private router: Router, private sharedService: SharedService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.sharedService.checkAuthority(state.url.split('/')[2]).pipe(
      map((res) => {
        this.sharedService.authorityType = res.Authority;
        if (res.Authority === 'None') {
            this.router.navigateByUrl('/');
            this.notify.error('Access Denied', 'Organizer access only !');
            return false;
          } else {
            return true;
          }
      }, error => {
        this.router.navigateByUrl('/');
        return false
      })
    )
      ;
  }
}
