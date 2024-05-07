import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {TranslateModule} from "@ngx-translate/core";
import {CommonModule, NgClass, NgForOf, NgIf} from "@angular/common";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";
import {ImageCropperModule} from "ngx-image-cropper";
import {NzDividerModule} from "ng-zorro-antd/divider";

import {GetArena} from "../state/arenas.action";
import {ArenaService} from "../service/arena.service";

@Component({
  selector: 'app-arena-settings',
  templateUrl: './arena-settings.component.html',
  styleUrls: ['./arena-settings.component.scss'],
  imports: [CommonModule, NzFormModule, TranslateModule,
     NzButtonModule, ImageCropperModule, NzDividerModule,
     RouterLink, RouterOutlet, NzTabsModule, RouterLinkActive],

  standalone: true
})
export class ArenaSettingsComponent implements OnInit{
  settingsTabs:any;
  isEdit: boolean;
  webView: boolean;
  constructor(private router: Router , private store:Store , private activatedRoute: ActivatedRoute , private arenaService: ArenaService) {
    this.webView = window.innerWidth > 992
    this.isEdit = this.router.url.includes('manage');
    if (this.isEdit){
      this.arenaService.arenaSlug = this.activatedRoute.snapshot.params['code']
      this.store.dispatch(new GetArena(this.activatedRoute.snapshot.params['code']))
      this.settingsTabs =[
        {name: 'arena_info' , route: './info'} ,
        {name: 'social_media' , route: './social-media'} ,
        {name: 'add-moderator' , route: './add-moderator'} ,
      ]
    }

  }
  ngOnInit() {
  }
}
