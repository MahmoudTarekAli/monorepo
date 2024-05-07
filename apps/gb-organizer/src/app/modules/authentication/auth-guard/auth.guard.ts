import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../services/auth.service';
import {catchError, map} from "rxjs/operators";
import {of} from "rxjs";

@Injectable()
export class CanActivateViaAuthGuard  {
  status: any;

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate() {
    if (this.authService.isAutheiticated) {
      return true
    } else {
      return this.authService.getAuthUser().pipe(map(res => {
            this.authService.isAutheiticated = true;
            return true
          }
        ),
        catchError(() => {
          this.router.navigateByUrl('/login');
          return of(false);
        }))
    }
  }

}
