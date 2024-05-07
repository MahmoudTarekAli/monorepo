import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TwoFactorAuthComponent} from "../two-factor-auth/two-factor-auth.component";

@Component({
  selector: 'app-security-privacy',
  standalone: true,
  imports: [CommonModule, TwoFactorAuthComponent],
  templateUrl: './security-privacy.component.html',
  styleUrls: ['./security-privacy.component.scss']
})
export class SecurityPrivacyComponent {

}
