import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable()
export class CanActivateIsViewerGuard  {
  status: any;

  constructor(private authService: AuthService, private router: Router) {
  }

  handleGuard() {
    const role = localStorage.getItem('user-role');
    if (role === 'viewer') {
      return false;
    } else {
      return true;
    }
  }

  canActivate() {
    return this.handleGuard();
  }
}
