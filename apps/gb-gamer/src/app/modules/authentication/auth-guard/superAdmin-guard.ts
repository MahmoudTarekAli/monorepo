import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthService} from "../services/auth.service";

@Injectable()
export class SuperAdminGuard  {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getAuthUser().pipe(map(res => {
      for (let i = 0; i < res.roles.length; i++) {
        if (res.roles[i].name === 'SuperAdmin') {
          return true;
        }
      }
      this.router.navigateByUrl('/404');
      return false
    }));

  }

}


