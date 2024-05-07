import {Component} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {SetStateActionNgxs} from 'src/app/store/setting_ngxs/actions';

@Component({
  selector: 'cui-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isSidebarOpen: boolean;
  isMenuCollapsed: boolean;
  isMenuShadow: boolean;
  isMenuUnfixed: boolean;
  menuLayoutType: string;
  menuColor: string;
  flyoutMenuColor: string;
  systemLayoutColor: string;
  isTopbarFixed: boolean;
  isFooterDark: boolean;
  isContentMaxWidth: boolean;
  isAppMaxWidth: boolean;
  isGrayBackground: boolean;
  isGrayTopbar: boolean;
  isCardShadow: boolean;
  isSquaredBorders: boolean;
  isBorderless: boolean;
  routerAnimation: string;
  locale: string;
  leftMenuWidth: Number;
  logo: string;
  authPagesColor: string;
  theme: string;
  primaryColor: string;

  defaultColor = '#4b7cf3';
  window: any = window as any;

  constructor(private store: Store
  ) {
    this.store.select(state => state.setting).subscribe(date => {
      const state = date.setting
      this.isSidebarOpen = state.isSidebarOpen;
      this.isMenuCollapsed = state.isMenuCollapsed;
      this.isMenuShadow = state.isMenuShadow;
      this.isMenuUnfixed = state.isMenuUnfixed;
      this.menuLayoutType = state.menuLayoutType;
      this.menuColor = state.menuColor;
      this.flyoutMenuColor = state.flyoutMenuColor;
      this.systemLayoutColor = state.systemLayoutColor;
      this.isTopbarFixed = state.isTopbarFixed;
      this.isFooterDark = state.isFooterDark;
      this.isContentMaxWidth = state.isContentMaxWidth;
      this.isAppMaxWidth = state.isAppMaxWidth;
      this.isGrayBackground = state.isGrayBackground;
      this.isGrayTopbar = state.isGrayTopbar;
      this.isCardShadow = state.isCardShadow;
      this.isSquaredBorders = state.isSquaredBorders;
      this.isBorderless = state.isBorderless;
      this.routerAnimation = state.routerAnimation;
      this.locale = state.locale;
      this.leftMenuWidth = state.leftMenuWidth;
      this.logo = state.logo;
      this.authPagesColor = state.authPagesColor;
      this.theme = state.theme;
      this.primaryColor = state.primaryColor;
    });
  }

  toggle() {
    this.store.dispatch(
      new SetStateActionNgxs({
        isSidebarOpen: !this.isSidebarOpen,
      }),
    );
  }

  settingChange(value: boolean, setting: string) {
    this.store.dispatch(
      new SetStateActionNgxs({
        [setting]: value,
      }),
    );
  }

  setWidth(value: number) {
    this.store.dispatch(
      new SetStateActionNgxs({
        leftMenuWidth: value,
      }),
    );
  }

  setTheme(nextTheme) {
    this.store.dispatch(
      new SetStateActionNgxs({
        theme: nextTheme,
      }),
    );
  }

  setPrimaryColor(e) {
    const color = e.target ? e.target.value : e;
    const addStyles = () => {
      const styleElement = document.querySelector('#primaryColor');
      if (styleElement) {
        styleElement.remove();
      }
      const body = document.querySelector('body');
      const styleEl = document.createElement('style');
      const css = document.createTextNode(`:root { --kit-color-primary: ${color};}`);
      styleEl.setAttribute('id', 'primaryColor');
      styleEl.appendChild(css);
      body.appendChild(styleEl);
    };
    addStyles();
    this.store.dispatch(
      new SetStateActionNgxs({
        primaryColor: color,
      }),
    );
  }

  resetColor() {
    this.setPrimaryColor(this.defaultColor);
  }
}
