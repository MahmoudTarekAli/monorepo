import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NavbarComponent} from "../navbar/navbar.component";
import {ChallengeCardComponent} from "../../shared/components/gb-card/challenge-card.component";
import {GameCardComponent} from "../../shared/components/game-card/game-card.component";
import {AdBannerComponent} from "../../shared/components/ad-banner/ad-banner.component";
import {ArenaCardComponent} from "../../shared/components/arena-card/arena-card.component";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";
import {AuthService} from "../../modules/authentication/services/auth.service";
import {Router, RouterOutlet} from "@angular/router";
import {FooterComponent} from "../footer/footer.component";
import {Select, Store} from "@ngxs/store";
import {AuthenticationState} from "../../modules/authentication/state/authentication.state";
import {Observable} from "rxjs";
import {User} from "../../modules/authentication/models/user";
import {GlobalService} from "../../shared/service/global.service";

@Component({
  selector: 'app-layout',
  standalone: true,
    imports: [CommonModule, NzLayoutModule, NzMenuModule, NavbarComponent, ChallengeCardComponent, GameCardComponent, AdBannerComponent, ArenaCardComponent, NzFormModule, FormsModule, NzButtonModule, ReactiveFormsModule, RouterOutlet, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  mobileView = false;

  routes = []
  @Select(AuthenticationState.getUser) userData$: Observable<User>;
  constructor(private authService: AuthService , public router:Router, private store: Store , public globalService: GlobalService) {
    // this.mobileView = window.screen.width < 776;
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting
      this.mobileView = state.isMobileView;
    });
  }

}
