import {Component, Inject, OnInit} from '@angular/core'
import {TranslateService} from '@ngx-translate/core'
import {Router, NavigationEnd, ActivatedRoute, NavigationStart} from '@angular/router'
import {Title} from '@angular/platform-browser'
import {filter, map, mergeMap} from 'rxjs/operators'
import {Select, Store} from '@ngxs/store'
import store from 'store'
import english from './locales/en-US'
import arabic from './locales/ar-EG'
import {SetStateActionNgxs} from './store/setting_ngxs/actions'
import {Observable, Subscription} from 'rxjs'
import {Tournament} from './modules/tournaments/models/tournament'
import {GetTournaments} from './modules/tournaments/state/tournament.action'
import {SetUser} from './modules/authentication/state/authentication.action'
import {AuthenticationState} from './modules/authentication/state/authentication.state'
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {DOCUMENT} from "@angular/common";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {NzModalService} from "ng-zorro-antd/modal";
import {ConfirmUsernameComponent} from "./shared/dialogs/confirm-username/confirm-username.component";

const locales = {
  'en-US': english,
  'ar-EG': arabic,
}

@Component({
  selector: 'app-root',
  template: `
      <ng-progress></ng-progress>
      <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  locale: string
  theme: string
  logo: string
  pageTitle = 'GBarena'
  @Select(AuthenticationState.getAuth) user$: Observable<{}>;
  subscription: Subscription

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    // tslint:disable-next-line:no-shadowed-variable
    private store: Store,
    translate: TranslateService,
    private modalService: NzModalService
  ) {
    Object.keys(locales).forEach(locale => {
      translate.setTranslation(locale, locales[locale])
    })
    translate.setDefaultLang('en-US')

    // localization && theme listener
    this.store.dispatch(new SetUser());

    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting
      if (state.locale) {
        this.changeCssFile(state.locale)
        translate.use(state.locale)

      }
      if (this.theme !== state.theme) {
        this.setTheme(state.theme)
      }
      this.locale = state.locale
      this.theme = state.theme
      this.logo = state.logo
      this.setTitle()
      if (localStorage.getItem('setting')) {
        const keys = JSON.parse(localStorage.getItem('setting'))
        Object.entries(keys.setting).forEach(
          // @ts-ignore
          ([key, value]) => localStorage.setItem(`app.settings.${key}`, value)
        )
      }
    })
  }

  @Select(AuthenticationState.getAuth) user: Observable<{}>;


  ngOnInit() {
    // this.getTournaments()
    this.subscription = this.user$.subscribe((user: any) => {
      if (user) {
        if (user?.username_changes_count === 0) {
          this.modalService.create({
            nzContent: ConfirmUsernameComponent,
            nzData: {
              username: user.username,
              referenceNumber: user.reference_number

            },
            nzFooter: null,
            nzCentered: true,
            nzWidth: '600px',
            nzClassName: 'default-modal'
          })
        }
        this.subscription?.unsubscribe()
      }
    })
    // set page title from router data variable
    this.router.events.pipe(filter(event => event instanceof NavigationEnd), map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild
        }
        return route
      }),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild
        }
        return route
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data),
    )
      .subscribe(event => {
        this.pageTitle = event.title
        this.setTitle()
      })

    // detecting & set mobile/tablet/desktop viewports
    const setViewPort = (isMobileView: any = false, isTabletView: any = false) => {
      this.store.dispatch(
        new SetStateActionNgxs({
          isMobileView,
        }),
      )
      this.store.dispatch(
        new SetStateActionNgxs({
          isTabletView,
        }),
      )
    }
    const detectViewPort = (load = false) => {
      const _isMobileView = window.innerWidth < 768
      const _isTabletView = window.innerWidth < 992
      const _isDesktopView = !_isMobileView && !_isTabletView
      const isMobileView = store.get('app.settings.isMobileView')
      const isTabletView = store.get('app.settings.isTabletView')
      const isDesktopView = !isMobileView && !isTabletView
      if (_isDesktopView && (_isDesktopView !== isDesktopView || load)) {
        setViewPort(false, false)
      }
      if (_isTabletView && !_isMobileView && (_isTabletView !== isTabletView || load)) {
        setViewPort(false, true)

        this.store.dispatch(
          new SetStateActionNgxs({
            isMenuCollapsed: false,
          }),
        )
      }
      if (_isMobileView && (_isMobileView !== isMobileView || load)) {
        setViewPort(true, false)
      }
    }
    detectViewPort(true)
    window.addEventListener('resize', () => {
      detectViewPort()
    })

    // set primary color on app load
    const primaryColor = () => {
      const color = store.get('app.settings.primaryColor')
      if (color) {
        const addStyles = () => {
          const styleElement = document.querySelector('#primaryColor')
          if (styleElement) {
            styleElement.remove()
          }
          const body = document.querySelector('body')
          const styleEl = document.createElement('style')
          const css = document.createTextNode(`:root { --kit-color-primary: ${color};}`)
          styleEl.setAttribute('id', 'primaryColor')
          styleEl.appendChild(css)
          body.appendChild(styleEl)
        }
        addStyles()
        this.store.dispatch(
          new SetStateActionNgxs({
            primaryColor: color,
          }),
        )
      }
    }
    primaryColor()
  }



  changeCssFile(lang: string) {
    const headTag = this.document.getElementsByTagName('head')[0] as HTMLHeadElement
    const existingLink = this.document.getElementById('langCss') as HTMLLinkElement
    const bundleName = lang === 'en-US' ? 'global.scss' : 'global-ar.scssg'
    // console.log(bundleName)
    if (existingLink) {
      existingLink.href = bundleName
    } else {
      const newLink = this.document.createElement('link')
      newLink.rel = 'stylesheet'
      newLink.type = 'text/css'
      newLink.id = 'langCss'
      newLink.href = bundleName
      headTag.appendChild(newLink)
    }
  }


  // set title
  setTitle = () => {
    // this.titleService.setTitle(`${this.logo} | ${this.pageTitle}`)
  }

  // set version
  setVersion = version => {
    this.document.querySelector('html').setAttribute('data-kit-version', version)
  }

  // set theme
  setTheme = theme => {
    this.document.querySelector('html').setAttribute('data-kit-theme', theme)
    if (theme === 'default') {
      this.store.dispatch(
        new SetStateActionNgxs({
          menuColor: 'light',
        }),
      )
    }
    if (theme === 'dark') {
      this.store.dispatch(
        new SetStateActionNgxs({
          menuColor: 'dark',
        }),
      )
    }
  }

}


