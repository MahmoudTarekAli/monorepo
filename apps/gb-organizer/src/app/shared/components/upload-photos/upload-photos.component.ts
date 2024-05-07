import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {base64ToFile, ImageCropperModule} from "ngx-image-cropper";
import {GlobalService} from "../../services/global.service";

@Component({
  selector: 'app-upload-photos',
  templateUrl: './upload-photos.component.html',
  styleUrls: ['./upload-photos.component.scss']
})
export class UploadPhotosComponent implements OnInit{
  [key: string]: any;
  imageChangedEvent: any;
  ImageType: string
  @Input() avatar: any
  @Input() cover: any
  openImageCropper = false
  imageHolder: any
  @Input() cropRatio = 1
  @Input() resizeToWidth = 700;
  @Input() resizeToHeight = 700;
  @Input() coverCropRatio = 96 / 35
  @Input() coverResizeToWidth = 1920
  @Input() coverResizeToHeight = 700
  @Input() isEdit = false;
  @Output() fileSelected = new EventEmitter<any>();
  @Input() isShowProfile = true
  @Input() isShowCover = true

  constructor(private globalService: GlobalService) {
  }
  ngOnInit() {
  }
  imageCropped(event: any, imageType: string) {
    this.imageHolder = event
  }
  convertBlobToFile(blob: Blob, fileName: string): File {
    const file = new File([blob], fileName);
    return file;
  }
  onModalOk(imageType: string) {
    this[imageType] = base64ToFile(this.imageHolder.base64);
    this.fileSelected.emit({[imageType]: this.convertBlobToFile(this[imageType], imageType === 'avatar' ? 'avatar' : 'cover') , [imageType === 'avatar' ? 'avatarImageHolder' : 'coverImageHolder']: this.imageHolder.base64} )
    this.openImageCropper = false
  }
  fileChangeEvent(event: any, imageType: string): void {
    this.imageChangedEvent = event;
    // console.log(event.target.file)
    this.openImageCropper = true
    this.ImageType = imageType
    console.log(this.ImageType , imageType)
    if (this.ImageType === 'cover') {
      this.resizeToWidth = this.coverResizeToWidth
      this.resizeToHeight = this.coverResizeToHeight
      this.cropRatio = this.coverCropRatio
    } else {
      this.resizeToWidth = 700
      this.resizeToHeight = 700
      this.cropRatio = 1
    }
  }
}
