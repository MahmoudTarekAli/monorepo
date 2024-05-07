import {Component, OnInit} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {NgIf, UpperCasePipe} from "@angular/common";
import {ButtonComponent} from "../../../../components/button/button.component";
import {NzModalRef} from "ng-zorro-antd/modal";
import {FormsModule} from "@angular/forms";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {NzGridModule} from "ng-zorro-antd/grid";

@Component({
  selector: 'app-refer-friend',
  templateUrl: './refer-friend.component.html',
  styleUrls: ['./refer-friend.component.scss'],
  imports: [
    TranslateModule,
    UpperCasePipe,
    ButtonComponent,
    FormsModule,
    NzTypographyModule,
    NzGridModule,
    NgIf
  ],
  standalone: true
})
export class ReferFriendComponent implements OnInit{
  joinedAccount: any;
  challenge:any
    constructor(private modal:NzModalRef) { }

    ngOnInit(): void {
    console.log(this.challenge)
    }
    closeDialog() {
      this.modal.close()
    }

}
