import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonComponent} from "../../../components/button/button.component";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {NzPopoverModule} from "ng-zorro-antd/popover";

@Component({
  selector: 'app-filter-popover',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NzRadioModule, TranslateModule, FormsModule, NzPopoverModule],
  templateUrl: './filter-popover.component.html',
  styleUrls: ['./filter-popover.component.scss']
})
export class FilterPopoverComponent {
  filters = [
    {name: 'Open', value: 'Open'},
    {name: 'Live', value: 'Live'},
    {name: 'Finished', value: 'Finished'},
  ];
  @Output() statusFiltration =  new EventEmitter();
  @Input() type: string;
  status: string;
  popoverFilterVisible: boolean = false;
  constructor() {

  }
  ngOnInit() {
    if (this.type === 'matches'){
      this.filters = [
        {name: 'To be played', value: 'To be played'},
        {name: 'Live', value: 'Live'}
      ];
    }
  }

  filterStatus(value) {
    this.statusFiltration.emit(value);
    this.popoverFilterVisible = false;

  }

}
