import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SetUser} from "../../modules/authentication/state/authentication.action";
import {AuthService} from "../../modules/authentication/services/auth.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ButtonComponent} from "../button/button.component";
import {Store} from "@ngxs/store";
import {HandleError} from "../../shared/state/global.action";

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent {
  message: string;
  loading = false

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService , private store: Store , private router: Router) {
  this.message = 'Please wait, we are currently verifying your account';
  this.activatedRoute.queryParams.subscribe(params => {
    this.loading = true
    if (params['verify_token']) {
      const body = {
        id: params['id'],
        slug: params?.['slug'],
        verify_token: params['verify_token']
      }
      // console.log(this.authService.isLoggedIn())
      this.authService.verifyEmail(body).subscribe(data => {
        this.message = 'Thank you, your account has been verified';
        localStorage.setItem('token', data.token);
        this.store.dispatch(new SetUser());

      },error => {
        this.store.dispatch(new HandleError(error));
      })
    }else {
      this.router.navigateByUrl('/404');

    }
  })
}
ngOnInit(): void {
}
}
