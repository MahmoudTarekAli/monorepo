import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GlobalService} from "../../shared/service/global.service";

@Component({
  selector: 'app-user-timezone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-timezone.component.html',
  styleUrls: ['./user-timezone.component.scss']
})
export class UserTimezoneComponent {
constructor(public globalService: GlobalService) {
}
}
