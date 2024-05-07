import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Select, Store} from "@ngxs/store";
import {AuthenticationState} from "../../modules/authentication/state/authentication.state";
import {Observable} from "rxjs";
import {User} from "../../modules/authentication/models/user";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ButtonComponent} from "../button/button.component";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {AuthService} from "../../modules/authentication/services/auth.service";
import {GlobalService} from "../../shared/service/global.service";
import {GlobalState} from "../../shared/state/global.state";
import {NzProgressModule} from "ng-zorro-antd/progress";
import {InfoCardComponent} from "../../shared/components/info-card/info-card.component";
import {environment} from "../../../environments/environment";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {TranslateModule} from "@ngx-translate/core";
import {SetStateActionNgxs} from "../../store/setting_ngxs/actions";

@Component({
  selector: 'app-user-menu',
  standalone: true,
    imports: [CommonModule, NzDividerModule, RouterLink, FormsModule, ButtonComponent, NzRadioModule, NzProgressModule, InfoCardComponent, NzTypographyModule, TranslateModule],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit{
  @Select(AuthenticationState.getUser) userData: Observable<User>;
  @Select(GlobalState.getMonthlyJoinsCounts) monthlyJoinsCounts$: Observable<any>;
  menuViewName = '';
  @Input() isDrawer: boolean;
  environment = environment;
  isMobileView: boolean;
  @Output() closeDrawer = new EventEmitter();

  constructor(public authService: AuthService , private store:Store , private router:Router , public globalService:GlobalService) {
  }
  ngOnInit(): void {
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting
      this.isMobileView = state.isMobileView;
    });
    if (this.isMobileView){
      this.router.events.subscribe((val) => {
        this.closeDrawer.emit();
      })
    }
  }
  changeMenuViewName(name: string) {
    this.menuViewName = name
  }
  changeLanguage(lang: string) {
    this.globalService.selectedLanguage = lang;
    this.store.dispatch(
      new SetStateActionNgxs({
        locale: lang,
      }),
    )
  }
}
