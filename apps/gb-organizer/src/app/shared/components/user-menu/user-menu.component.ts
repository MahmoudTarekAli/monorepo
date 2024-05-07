import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ButtonComponent} from "../button/button.component";
import {NzRadioModule} from "ng-zorro-antd/radio";
import { NzProgressModule } from 'ng-zorro-antd/progress';
import {InfoCardComponent} from "../info-card/info-card.component";
import {AuthenticationState} from "../../../modules/authentication/state/authentication.state";
import {GlobalState} from "../../state/global.state";
import {User} from "../../../modules/authentication/models/user";
import {AuthService} from "../../../modules/authentication/services/auth.service";
import {environment} from "../../../../environments/environment";
import {SetStateActionNgxs} from "../../../store/setting_ngxs/actions";

@Component({
  selector: 'app-user-menu',
  standalone: true,
    imports: [CommonModule, NzDividerModule, RouterLink, FormsModule, ButtonComponent, NzRadioModule, NzProgressModule, InfoCardComponent],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit{

  @Select(AuthenticationState.getAuth) userData: Observable<User>;
  @Select(GlobalState.getMonthlyJoinsCounts) monthlyJoinsCounts$: Observable<any>;
  menuViewName = '';
  selectedLanguage: string;
  @Input() isDrawer: boolean;
  environment = environment;
  isMobileView: boolean;
  @Output() closeDrawer = new EventEmitter();

  constructor(public authService: AuthService , private store: Store , private router: Router) {
  }
  ngOnInit(): void {
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting
      this.isMobileView = state.isMobileView;
      this.selectedLanguage = state.locale;
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
    this.selectedLanguage = lang;
    this.store.dispatch(
      new SetStateActionNgxs({
        locale: lang,
      }),
    )
  }
}
