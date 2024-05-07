import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCoins',
  standalone: true
})
export class FormatCoinsPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'm';
    } else if (value >= 10000) {
      if (value % 1000 === 0) {
        return (value / 1000).toFixed(0) + 'k';
      } else {
        const parts = (value / 1000).toString().split('.');
        if (parts[1].length >= 3) {
          const floorNumber = Math.floor(Number(parts[1]) / 100)
          return Number(parts[0] + '.' + floorNumber) + 'k';
        } else {
          return (value / 1000).toFixed(1) + 'k';
        }
      }
    }
    return value;
  }

}
