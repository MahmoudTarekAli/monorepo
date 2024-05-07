import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'responsiveImage',
  standalone: true
})
export class ResponsiveImagePipe implements PipeTransform {
  transform(imageUrls: any): string {
    const screenWidth = window.innerWidth;
    let imageUrl: string;

    if (screenWidth >= 1024) {
      imageUrl = imageUrls.l;
    } else if (screenWidth >= 768) {
      imageUrl = imageUrls.m;
    } else {
      imageUrl = imageUrls.s;
    }

    return imageUrl;
  }

}
