import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "./modules/authentication/services/auth.service";
import {Actions, ofActionDispatched, Select, Store} from "@ngxs/store";
import {SetUser, UserCompleted} from "./modules/authentication/state/authentication.action";
import {GetCoins, GetCountries} from "./shared/state/global.action";
import {SetStateActionNgxs} from "./store/setting_ngxs/actions";
// @ts-ignore
import english from './locales/en-US.json'
// @ts-ignore
import arabic from './locales/ar-EG.json'
import {TranslateService} from "@ngx-translate/core";
import {DOCUMENT} from "@angular/common";
import {AuthenticationState} from "./modules/authentication/state/authentication.state";
import {Observable, Subject, Subscription, take} from "rxjs";
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {MessengerState} from "./modules/messenger/state/messenger.state";
import {User} from "./modules/authentication/models/user";
import {chatbox} from "./modules/messenger/modal/messenger";
import {user} from "@angular/fire/auth";
import {
  CloseChatBox,
  OpenChatBox,
  ReOrderChatBoxList,
  SetMessagesList, SetMessengerCount
} from "./modules/messenger/state/messenger.action";
import {GlobalService} from "./shared/service/global.service";
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {SelectRoleComponent} from "./shared/modals/select-role/select-role.component";
import {ConfirmUsernameComponent} from "./shared/modals/confirm-username/confirm-username.component";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../environments/environment";

const locales: any = {
  'en-US': english,
  'ar-EG': arabic,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'gbarena';
  isEtisalat = false
  @Select(AuthenticationState.isAuthenticated) isLoggedIn$: Observable<{}>;
  @Select(AuthenticationState.getUser) user$: Observable<{}>;
  @Select(MessengerState.getChatList) chatList$: Observable<chatbox[]>;
  chatboxes: chatbox[]
  conversationList: any = []
  subscription: Subscription
  env = environment
  isVerified = true

  constructor(private authService: AuthService, public globalService: GlobalService, private modalService: NzModalService, private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef, public db: AngularFirestore, public afsAuth: AngularFireAuth, public fns: AngularFireFunctions, private cookies: CookieService,
              private store: Store, private translate: TranslateService, @Inject(DOCUMENT) private document: Document, private router: Router, private actions$: Actions) {

    activatedRoute.queryParams.subscribe(queryParam => {
      if (queryParam['social_login']) {
        this.authService.VerifySocialUser(queryParam['social_login']).subscribe(res => {
          localStorage.setItem('token', res.token);
          // router.navigate([router.url.split('?social_login=')[0]]);
          this.store.dispatch(new SetUser());
          if (sessionStorage.getItem('source')) {
            const source = sessionStorage.getItem('source')
            sessionStorage.removeItem('source')
            this.router.navigateByUrl(source)
          }
          // router.navigate([localStorage.getItem('savingRoute')])
        })
      }
      if (queryParam['phoneNumber'] && queryParam['msisdn'] ) {
        const body = {phone_number: queryParam['phoneNumber'], hmac: queryParam['msisdn']}
        this.authService.ctPaymentInfo.next(body)
        localStorage.setItem('activationCt', JSON.stringify(body));
        this.router.navigate([], {
          queryParams: {'phoneNumber': null , 'msisdn': null},
          queryParamsHandling: 'merge'
        })
        }
      if (queryParam['error']) {
        sessionStorage.setItem('social_login_error', queryParam['error'])
        if (sessionStorage.getItem('source')) {
          const source = sessionStorage.getItem('source')
          sessionStorage.removeItem('source')
          this.router.navigateByUrl(source)

        }
        // router.navigate([localStorage.getItem('savingRoute')])
      }
    })
    router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        const url: string = val.url.split('?')[0]
        // console.log(url)
        if (url.includes('etisalat-gaming-eg')) {
          this.changeCssFile('etisalat-styles.css')
          this.isEtisalat = true
          this.isEtisalat = true
        } else if (url.includes('playgrounds')) {
          this.changeCssFile('playgrounds-styles.css')
          this.isEtisalat = true
        }  else if (url.includes('riot-ramadan-quests')) {
          this.changeCssFile('riot-ramadan-styles.css')
          this.isEtisalat = true
        } else if (this.isEtisalat) {
          this.isEtisalat = false
          // default
          this.changeCssFile('styles.scss')
        }
      }
    })
    Object.keys(locales).forEach(locale => {
      translate.setTranslation(locale, locales[locale])
    })
    translate.setDefaultLang('en-US')

    this.chatList$.subscribe((chatboxes: chatbox[]) => {
      this.chatboxes = chatboxes
    })
    if (localStorage.getItem('setting')) {
      const setting = JSON.parse(localStorage.getItem('setting'))
      this.store.dispatch(new SetStateActionNgxs(setting))

    }
    // this.store.dispatch(new SetUser());
    this.store.dispatch(new GetCountries())
    this.store.select(state => state.setting).subscribe(data => {
      const state = data?.setting
      localStorage.setItem('setting', JSON.stringify(data.setting))
      if (state?.locale) {
        // this.changeCssFile(state.locale)
        // console.log(state.locale)
        translate.use(state.locale)
        this.globalService.selectedLanguage = state.locale
      }

    })
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
      const isMobileView = Boolean(localStorage.getItem('app.settings.isMobileView'))
      const isTabletView = Boolean(localStorage.getItem('app.settings.isTabletView'))
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
  }


  ngOnInit() {
    this.user$.subscribe(data => {
      if (data) {
        this.store.dispatch(new GetCoins())
        this.createUser()
      }
    })

    this.actions$.pipe(ofActionDispatched(UserCompleted)).subscribe(() => {
      this.authService.loadingUser = false
    })
    this.subscription = this.user$.subscribe((user: User) => {
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
            nzClassName: 'challenge-modal'
          })

        }
        this.subscription.unsubscribe()
      }
    })
  }

  swapSelectedIndexWithIndex2(selectedIndex: number): void {
    [this.chatboxes[selectedIndex], this.chatboxes[2]] = [this.chatboxes[2], this.chatboxes[selectedIndex]];
    this.store.dispatch(new ReOrderChatBoxList(this.chatboxes))
    this.changeDetectorRef.detectChanges();

  }

  changeCssFile(route: string) {
    const headTag = this.document.getElementsByTagName('head')[0] as HTMLHeadElement
    const existingLink = this.document.getElementById('langCss') as HTMLLinkElement

    const bundleName = route
    if (existingLink) {
      existingLink.href = bundleName
    } else {
      const style = document.createElement('link');
      style.rel = 'stylesheet'
      style.type = 'text/css'
      style.id = 'langCss'
      style.href = bundleName
      // document.head.appendChild(style)
      headTag.appendChild(style)
    }
  }



  createUser() {
    const data = this.fns.httpsCallable('createUser');
    data({
      authorization: 'Bearer '
        + localStorage.getItem('token'),
    }).subscribe(res => {
      this.afsAuth.signInWithCustomToken(res).then(res => {
        this.getUserChatMessage()
      })
    })

  }

  getUserChatMessage() {
    // this.zone.run(() => {
    this.db.firestore
      .collection('groups')
      .where('view', 'array-contains', parseInt(localStorage.getItem('User')))
      .onSnapshot(res => {
        res.query.firestore.collection('groups').where('readBy', 'array-contains', parseInt(localStorage.getItem('User'))).where('type', '!=', 'match').onSnapshot(res => {
          // this.globalService.messageCount = res.size
          this.store.dispatch(new SetMessengerCount(res.size))
        })
        res.docChanges().forEach(async (data) => {
          if (data.doc.get('type') === 'marketing') {
            this.conversationList.push(data.doc.data())
            // console.log(this.conversationList)
            this.store.dispatch(new SetMessagesList(data.doc.data()))
          }
          if (data.type === 'modified') {

            if (data.doc.get('type') === 'tournament_message') {
              let tournamentMessageData = data.doc.data();
              await data.doc.ref.firestore.collection('tournaments')
                .doc(data.doc.get('tournament_code'))
                .onSnapshot((tournament: any) => {
                  let Data = {...data.doc.data(), ...tournament.data()};
                  this.conversationList.map((chat: any) => {
                    if (chat.code === Data['code']) {
                      chat.updated_at = data.doc.get('updated_at');
                      chat.last_message = data.doc.get('last_message');
                    }
                  });
                });
            } else {
              let user: any
              if (data.doc.get('type') === 'private') {
                // @ts-ignore
                // console.log(data.doc.data())
                const userId = parseInt(localStorage.getItem('User'));
                user = await this.globalService.getUsersByIds([data.doc.data()['members'].find((num: any) => num !== userId)]);
              }
              this.conversationList.map((chat: any) => {
                  if (chat.id === data.doc.id) {
                    chat.updated_at = data.doc.get('updated_at');
                    chat.last_message = data.doc.get('last_message');
                    chat.user = (user !== undefined && {
                      name: user[0].username,
                      avatar: user[0].avatar,
                      userId: user[0].id
                    })
                    chat.readBy = data.doc.get('readBy')
                    let lastChat = {...data.doc.data()}
                    lastChat = {
                      ...data.doc.data(),
                      ...(user !== undefined && {
                        name: user[0].username,
                        avatar: user[0].avatar,
                        userId: user[0].id
                      })
                    }
                    if (!this.chatboxes.some(chatBoxes => chatBoxes.chat.id === data.doc.ref.id) && !this.router.url.includes('messages')) {
                      this.store.dispatch(new OpenChatBox(<chatbox>{chat: lastChat, show: true}))
                    }
                  }
                }
              );

            }
          } else if (data.type === 'added') {
            if (data.doc.get('type') === 'tournament_message' || data.doc.get('type') === 'private') {
              let user: any
              if (data.doc.get('type') === 'private') {
                // @ts-ignore
                // console.log(data.doc.data())
                const userId = parseInt(localStorage.getItem('User'));
                user = await this.globalService.getUsersByIds([data.doc.data()['members'].find((num: any) => num !== userId)]);
              }
              await data.doc.ref.firestore.collection('tournaments')
                .doc(data.doc.get('tournament_code'))
                .onSnapshot((tournament: any) => {
                  const Data = {
                    ...data.doc.data(),
                    ...tournament.data(),
                    panel: false,
                    loading: true,
                    messages: [],
                    ...(user !== undefined && {name: user[0].username, avatar: user[0].avatar, userId: user[0].id})
                  };
                  this.conversationList.push(Data)
                  // this.conversationList.sort((a: any, b: any) => b.updated_at - a.updated_at)
                  // console.log( this.conversationList.sort((a: any, b: any) => b.updated_at - a.updated_at))
                  this.store.dispatch(new SetMessagesList(Data))
                });
            }
          }
        });
        // console.log(this.conversationList)
        // this.globalService.messgesRecived.next({loaded: true});
      });

    // })

  }

  closeChat(id: any) {
    this.store.dispatch(new CloseChatBox(id))
  }
}

