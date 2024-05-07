/**
 * Created by ObadaDarwish on 07/09/2017.
 */
import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'ordinal',
  standalone: true
})
export class OrdinalNumbers implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(number: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const remainder = number % 100;

    if (remainder === 11 || remainder === 12 || remainder === 13) {
      return number.toString() + 'th';
    }

    const lastDigit = number % 10;
    const suffix = suffixes[lastDigit] || 'th';

    return number.toString() + suffix;
  }
}
