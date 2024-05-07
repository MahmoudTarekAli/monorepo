import {Pipe} from "@angular/core";
import {TimeAgoPipe} from "time-ago-pipe";
@Pipe({
  name: 'timeAgo',
  pure: false,
  standalone: true
})
export class TimeAgoExtendsPipe extends TimeAgoPipe {
}
