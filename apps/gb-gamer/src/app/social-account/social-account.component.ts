import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-social-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-account.component.html',
  styleUrls: ['./social-account.component.scss']
})
export class SocialAccountComponent {
  @Input() socialAccount: any;

  constructor() {
  }

  ngOnInit() {

  }
}
