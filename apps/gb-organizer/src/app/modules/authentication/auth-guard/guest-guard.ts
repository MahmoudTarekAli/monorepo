import { Router } from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class GuestGuard  {

  constructor( private router: Router) {}

  canActivate() {
    const token = localStorage.getItem('token');
    if (token !== null) {
      this.router.navigate(['/'])
      return false;
    } else {
      return true
    }

  }
}
