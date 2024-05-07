import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, NzTypographyModule, TranslateModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {

}
