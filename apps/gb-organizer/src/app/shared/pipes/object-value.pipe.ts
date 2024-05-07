import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectValue'
})
export class ObjectValuePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    return value?.name;
  }

}
