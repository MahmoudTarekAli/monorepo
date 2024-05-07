import { Pipe, PipeTransform } from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {GlobalState} from "../state/global.state";
import {Observable} from "rxjs";
import {GetCountries} from "../state/global.action";

@Pipe({
  name: 'countryName',
  standalone: true
})
export class CountryNamePipe implements PipeTransform {
  @Select(GlobalState.getCountriesList) Countries: Observable<any>;

  constructor(private store: Store) {
    this.store.dispatch(new GetCountries())
  }
  transform(abbr: any):any {
    this.Countries.subscribe(data => {
      for (const country of data) {
        if (country.abbr === abbr) {
          console.log(country.name)
          return country.name
        }
      }
    })
  }

}
