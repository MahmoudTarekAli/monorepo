import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'defaultImage',

  standalone: true,

})
export class DefaultImagePipe implements PipeTransform {

  transform(imageUrl: string) {
    const placeholderImage = 'assets/images/default.webp'
    return imageUrl ? imageUrl : placeholderImage;
    // return null;
  }

}
