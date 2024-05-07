import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'convertNumToChar',
  standalone: true
})
export class ConvertNumToCharPipe implements PipeTransform {

  transform(num: any): any {
    return String.fromCharCode(65 + num);
  }

}
