import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {ButtonComponent} from "../../../../components/button/button.component";
import {GamerService} from "../../service/gamer.service";
import {Select, Store} from "@ngxs/store";
import {DisconnectSocialAccount, DisconnectThirdParty, GetThirdPartyIntegration} from "../state/gamer-settings.action";
import {AuthenticationState} from "../../../authentication/state/authentication.state";
import {Observable} from "rxjs";
import {User} from "../../../authentication/models/user";
import {GamerSettingsState} from "../state/gamer-settings.state";
import {PlaceHolderComponent} from "../../../../shared/components/place-holder/place-holder.component";

@Component({
  selector: 'app-third-party-intergrations',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonComponent, PlaceHolderComponent],
  templateUrl: './third-party-intergrations.component.html',
  styleUrls: ['./third-party-intergrations.component.scss']
})
export class ThirdPartyIntergrationsComponent {
  @Select(GamerSettingsState.getThirdParties) getThirdParties$: Observable<any>;

  constructor(private gamerService:GamerService, private store:Store) {
  }
  ngOnInit() {
  this.store.dispatch(new GetThirdPartyIntegration())

  }
  disconnectThirdParty(phoneNumber){
    this.store.dispatch(new DisconnectThirdParty(phoneNumber))
  }
}
