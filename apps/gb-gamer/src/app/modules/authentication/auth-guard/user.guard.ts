import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {GamerService} from "../../gamer/service/gamer.service";
import {environment} from "../../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {AuthResolver} from "../auth.resolver";
import {Observable, of} from "rxjs";

@Injectable()
export class UserGuard  {
  status: any;
  environment = environment;

  constructor(private authService: AuthService, private router: Router , private authResolver:AuthResolver) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this.authService.getAuthUser().pipe(map(res => {
          return true
          }
        ),
        catchError(() => {
          this.router.navigateByUrl('/');
          return of(false);
        }))
   // }

    // if (token !== null){
    //   return true
    // }else {
    //   window.location.href = environment.sso_url + '?source=' + window.origin + state.url;
    // }
  }
}
