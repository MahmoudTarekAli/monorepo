import {Component, HostListener, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from "../../../components/button/button.component";
import {SectionComponent} from "../../../components/section/section.component";
import {Simulate} from "react-dom/test-utils";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";

import input = Simulate.input;
import {Store} from "@ngxs/store";

@Component({
  selector: 'app-banner-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, SectionComponent, NzToolTipModule],
  templateUrl: './banner-card.component.html',
  styleUrls: ['./banner-card.component.scss']
})
export class BannerCardComponent  {
  @Input() banner: string;
  @Input() profile: string | null;
  @Input() gameIcon: string | null;
  @Input() inner: boolean;
  @Input() gameName: string | null;
  @Input() bannerHeight: boolean;
  @Input() isPremium: boolean;
  public getScreenWidth: any;
  isMobileView: boolean
  constructor(private store: Store) {
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting
      this.isMobileView = state.isMobileView;
    });
  }
  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
  }
}
