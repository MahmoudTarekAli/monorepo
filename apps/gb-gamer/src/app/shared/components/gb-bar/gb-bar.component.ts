import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {ButtonComponent} from "../../../components/button/button.component";
import {DefaultImagePipe} from "../../pipes/default-image.pipe";
import {RouterLink} from "@angular/router";
import {UserTimezoneComponent} from "../../../components/user-timezone/user-timezone.component";

@Component({
  selector: 'app-gb-bar',
  templateUrl: './gb-bar.component.html',
  styleUrls: ['./gb-bar.component.scss'],
  imports: [
    DatePipe,
    ButtonComponent,
    NgIf,
    NgForOf,
    DefaultImagePipe,
    RouterLink,
    UserTimezoneComponent,
    DecimalPipe
  ],
  standalone: true
})
export class GbBarComponent implements OnInit {
  @Input() card: any;
  @Input() type: string;
  @Input() isPrize: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
