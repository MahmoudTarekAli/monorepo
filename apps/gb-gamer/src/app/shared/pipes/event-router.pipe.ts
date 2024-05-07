import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'appEventRouter', standalone: true})
export class EventRouterPipe implements PipeTransform {
  transform(slug: any) {
    if (slug === 'riot-ramadan-quests'){
      return '/riot-ramadan-quests'
    } else{
      return [`/events/${slug}`]
    }

  }

}
