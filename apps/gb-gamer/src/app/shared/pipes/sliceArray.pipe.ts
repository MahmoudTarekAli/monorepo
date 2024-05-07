import {Pipe, PipeTransform} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {GlobalState} from "../state/global.state";
import {Observable} from "rxjs";
import {GetCountries} from "../state/global.action";
import {Tournament} from "../models/tournament";

@Pipe({
  name: 'sliceArray',
  standalone: true
})
export class SliceArrayPipe implements PipeTransform {

  constructor() {
  }

  transform(array: any[] | null, sliceNumber: number): any {
    if (array) {
      if (!Array.isArray(array)) {
        return array;
      }
      if(sliceNumber === 0){
        return array;
      }

      return array.slice(0, sliceNumber);
    }
  }

}
