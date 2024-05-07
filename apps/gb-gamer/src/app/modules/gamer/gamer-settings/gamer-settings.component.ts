import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {NzTabsModule} from "ng-zorro-antd/tabs";

@Component({
  selector: 'app-gamer-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, TranslateModule, NzTabsModule],
  templateUrl: './gamer-settings.component.html',
  styleUrls: ['./gamer-settings.component.scss']
})
export class GamerSettingsComponent implements OnInit{
  settingsTabs = [{name: 'user_info' , route: './user-info'} ,
    {name: 'security_privacy' , route: './security-privacy'} ,
    // {name: 'notifications' , route: './notifications'} ,
    {name: 'connect_accounts' , route: './connect-accounts'} ,
    {name: 'blocked_users' , route: './blocked-users'} ,
    {name: 'gamer.thirdPartyAccounts' , route: './third-parties'} ,
    ]
  isMobView: boolean ;
  isTabView: boolean ;
  webView: boolean;
  constructor(private store:Store) {
     this.webView = window.innerWidth > 992

    // this.store.select(state => state.setting).subscribe(data => {
    //   this.isMobView = data.setting.isMobileView
    //   this.isTabView = data.setting.isTabletView
    //   console.log(this.isMobView)
    //   console.log(this.isTabView)
    // })
  }
  ngOnInit() {
  }

}
