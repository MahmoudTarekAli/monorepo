import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'appArenaRouter', standalone: true})
export class FilterPipe implements PipeTransform {
  transform(slug: any) {
    if (slug === 'etisalat-gaming-eg') {
      return ['/etisalat-gaming-eg']
    } else {
      return [`/arenas/${slug}`]
    }
  }

}
