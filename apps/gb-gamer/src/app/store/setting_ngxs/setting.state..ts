import {Injectable} from '@angular/core';
import {State, Action, StateContext} from '@ngxs/store';
import {SetStateActionNgxs} from './actions';

export class SettingStateModel {
  setting: any;
}

@State<SettingStateModel>({
  name: 'setting',
  defaults: {
    setting: {
      authProvider: 'jwt',
      logo: 'Visual Builder',
      version: 'fluent',
      theme: 'dark',
      locale: 'en-US',
      isSidebarOpen: false,
      isSupportChatOpen: false,
      isMobileView: false,
      isTabletView: false,
      isMobileMenuOpen: false,
      isMenuCollapsed: false,
      isPreselectedOpen: false,
      isFullScreen: false,
      preselectedVariant: 'default',
      menuLayoutType: 'left',
      routerAnimation: 'slideFadeinUp', // none, slideFadeinUp, slideFadeinRight, Fadein, zoomFadein
      menuColor: 'gray',
      authPagesColor: 'gray',
      isAuthTopbar: true,
      primaryColor: '#4b7cf3',
      leftMenuWidth: 256,
      isMenuUnfixed: false,
      isMenuShadow: false,
      isTopbarFixed: true,
      isTopbarSeparated: false,
      isGrayTopbar: false,
      isContentMaxWidth: false,
      isAppMaxWidth: false,
      isGrayBackground: false,
      isCardShadow: true,
      isSquaredBorders: false,
      isBorderless: false,
      layoutMenu: 'classic',
      layoutTopbar: 'v1',
      layoutBreadcrumbs: 'v1',
      layoutFooter: 'v1',
      flyoutMenuType: 'default',
      flyoutMenuColor: 'blue',
      isOpenSideMenuCollapseArray: []
    },
  },
})
@Injectable()
export class SettingState {
  constructor() {
  }

  @Action(SetStateActionNgxs)
  setAppConfig(
    {getState, patchState}: StateContext<SettingStateModel>,
    {payload}: SetStateActionNgxs,
  ) {
    const state = getState();
    return patchState({
      setting: {...state.setting, ...payload},
    });
  }
}
