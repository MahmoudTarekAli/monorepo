import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Implement} from "@angular/cli/lib/config/workspace-schema";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-radio-buttons-filters',
  templateUrl: './radio-buttons-filters.component.html',
  styleUrls: ['./radio-buttons-filters.component.scss'],
  imports: [
    NzRadioModule,
    FormsModule, NgForOf
  ],
  standalone: true
})
export class RadioButtonsFiltersComponent  {
  @Output() itemsFiltration = new EventEmitter();
  @Input()  items: any
  @Input()  filterValue: string = ''
  constructor() {
  }
  ngOnInit(){

  }
  filterCard(event: any) {
    console.log(event)
    this.filterValue = event
    this.itemsFiltration.emit(event)
  }
}
