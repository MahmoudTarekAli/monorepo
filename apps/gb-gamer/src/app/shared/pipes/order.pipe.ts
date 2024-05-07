import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'order',
  standalone: true
})
export class OrderPipe implements PipeTransform {


  transform(int) {
    let intParsed = int;
    if (typeof (int) === 'string') {
      intParsed = parseInt(int);
    }
    // const ones = +intParsed % 10, tens = +intParsed % 100 - ones;
    //  console.log(ones)
    // return intParsed + ['th', 'st', 'nd', 'rd'][tens === 10 || intParsed > 3 ? 0 : ones];
    return intParsed + ['th', 'st', 'nd', 'rd'][intParsed > 3 ? 0 : intParsed];

  }


}
