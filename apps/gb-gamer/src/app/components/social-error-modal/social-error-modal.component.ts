import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-social-error-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-error-modal.component.html',
  styleUrls: ['./social-error-modal.component.scss']
})
export class SocialErrorModalComponent {
  @Input() error: any;

  constructor() {
    sessionStorage.removeItem('social_login_error')

  }
}
