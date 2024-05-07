/**
 * @author Ronak Patel
 * @description This pipe create for find difference between two date.
 */

import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "dateDifference",
  pure: true
})
export class TimeDifferencePipe implements PipeTransform {
  transform(startingDate?: any, endingDate?: any): any {
    const fromTime = new Date(startingDate);
    const toTime = new Date(endingDate);
    const differenceTravel = fromTime.getTime() - toTime.getTime();
    const seconds = Math.floor((differenceTravel) / (1000));
    return (Math.floor(seconds / 60));
  }
}
