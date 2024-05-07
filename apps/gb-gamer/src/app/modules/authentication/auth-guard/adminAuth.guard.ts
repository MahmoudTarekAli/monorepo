import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class CanActivateAdminGuard implements CanActivate {
  status: any;
  loginType = localStorage.getItem('login_type');

  constructor(private authService: AuthService, private router: Router) {
  }


  // @ts-ignore
  handleGuard = () => {
    if (this.loginType === 'admin') {
      this.authService.logout();
      return false
    } else {
      return true;
    }
  };

  canActivate() {
    return this.handleGuard();
  }
}

