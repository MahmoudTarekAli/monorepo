import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import {GamerService} from "../../gamer/service/gamer.service";
import {AuthService} from "../../authentication/services/auth.service";
import {map} from "rxjs/operators";

@Injectable()
export class AccountOwnerGuard  {
  status: any;

  constructor(private authService: AuthService, private router: Router, private gamerService: GamerService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.gamerService.isOwner(state.url.split('/')[2])){
      return true;
    }else{
      this.router.navigateByUrl('/404');
      return false;
    }
  }
}
