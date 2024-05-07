import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {TitleBarComponent} from "../title-bar/title-bar.component";

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
    imports: [CommonModule, TranslateModule, TitleBarComponent],
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent {

}
