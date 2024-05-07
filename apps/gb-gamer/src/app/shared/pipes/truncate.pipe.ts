import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})

export class TruncatePipe implements PipeTransform {

  transform(value: string, args: any): string {
    if (args && value) {
      const limit = parseInt(args, 10);
      const trail = '...';

      return value.length > limit ? value.substring(0, limit) + trail : value;
    } else {
      return value;
    }
  }
}
