import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  routeLogin(type?) {
    const routing = this.router.url.includes('login') ? this.router.url.replace('login' , '') : this.router.url
    // console.log(routing)
    // window.location.href = environment.sso_url + '?source=' + window.origin + routing
    if (type === 'login'){
      window.location.href = environment.sso_url + '?source=' + window.origin + routing
      // window.location.href = environment.sso_url + window.origin + routing
    } else{
      // window.location.href = environment.sso_url + window.origin + routing
      window.location.href = environment.sso_url + '?source=' + window.origin + routing
    }


  }

}
