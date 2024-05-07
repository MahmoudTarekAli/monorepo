import {Pipe, PipeTransform} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {GlobalState} from "../state/global.state";
import {Observable} from "rxjs";
import {GetCountries} from "../state/global.action";

@Pipe({
  name: 'countryImage',
  standalone: true
})
export class CountryPipe implements PipeTransform {
  @Select(GlobalState.getCountriesList) Countries: Observable<any>;

  constructor(private store: Store) {
    this.store.dispatch(new GetCountries())
  }

  transform(abbr: any) {
    let abbreviation
    this.Countries.subscribe(data => {
      for (const country of data) {
        if (country.abbr === abbr) {
          abbreviation = country.abbr.toLowerCase();
        } else if (country.name === abbr) {
          abbreviation = country.abbr.toLowerCase();
        }
      }
    })
    return `assets/flags/${abbreviation}.svg`
  }

}
