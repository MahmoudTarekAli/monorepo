import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'defaultImage'
})
export class DefaultImagePipe implements PipeTransform {

  transform(imageUrl: string) {
    const placeholderImage = 'assets/Blocks2.svg'
    return imageUrl ? imageUrl : placeholderImage;
    // return null;
  }

}
