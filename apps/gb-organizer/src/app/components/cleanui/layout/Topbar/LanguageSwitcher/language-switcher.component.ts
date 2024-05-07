import {Component} from '@angular/core'
import {TranslateService} from '@ngx-translate/core'
import {Select, Store} from '@ngxs/store'
import {SetStateActionNgxs} from "../../../../../store/setting_ngxs/actions";

@Component({
  selector: 'cui-topbar-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
})
export class TopbarLanguageSwitcherComponent {
  language: string
  mapFlags = {
    en: '/assets/flags/en.svg',
    ru: '/assets/flags/ru.svg',
    fr: '/assets/flags/fr.svg',
    zh: '/assets/flags/zh.svg',
    ar: '/assets/flags/eg.svg',
  }

  constructor(private translate: TranslateService, private store: Store) {
    this.store
      .select(state => state.setting)
      .subscribe(state => {
        this.language = state.setting.locale.substr(0, 2)
      });
  }

  changeLanguage(lang: any) {
    console.log(lang)
    this.store.dispatch(
      new SetStateActionNgxs({
       locale: lang,
      }),
    )
  }
}
