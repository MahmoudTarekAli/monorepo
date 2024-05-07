import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzGridModule} from "ng-zorro-antd/grid";
import {TranslateModule} from "@ngx-translate/core";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzModalModule} from "ng-zorro-antd/modal";
import {base64ToFile, ImageCropperModule} from "ngx-image-cropper";
import {NzButtonModule} from "ng-zorro-antd/button";
import {GlobalService} from "../../service/global.service";
import {DefaultImagePipe} from "../../pipes/default-image.pipe";
import {ButtonComponent} from "../../../components/button/button.component";
import {Store} from "@ngxs/store";
import {HandleError, SetNotifications} from "../../state/global.action";
import {UpdateUser} from "../../../modules/authentication/state/authentication.action";

@Component({
  selector: 'app-upload-photos',
  standalone: true,
  imports: [CommonModule, NzGridModule, TranslateModule, NzWaveModule, NzModalModule, ImageCropperModule, NzButtonModule, DefaultImagePipe, ButtonComponent],
  templateUrl: './upload-photos.component.html',
  styleUrls: ['./upload-photos.component.scss']
})
export class UploadPhotosComponent implements OnInit {
  [key: string]: any;

  imageChangedEvent: any;
  ImageType: string
  @Input() avatar: any
  @Input() cover: any
  openImageCropper = false
  imageHolder: any
  @Input() cropRatio: any
  @Input() resizeToWidth: number
  @Input() resizeToHeight: number
  @Input() isEdit = false;
  @Output() fileSelected = new EventEmitter<any>();
  isCropperDisabled: boolean
  gifImage: string
  @Input() isUserProfile: boolean

  constructor(private globalService: GlobalService , private store:Store) {
  }

  ngOnInit() {
  }

  imageCropped(event: any, imageType: string) {
    console.log(event)
    this.imageHolder = event
  }

  imageLoaded($event) {
    console.log($event)
    this.isCropperDisabled = $event.original.base64.split(',')[0].includes('gif');
    if (this.isCropperDisabled) {
      this.gifImage = $event.original.base64
    }
  }

  convertBlobToFile(blob: Blob, fileName: string): File {
    const file = new File([blob], fileName);
    return file;
  }

  onModalOk(imageType: string) {
    this[imageType] = base64ToFile(this.imageHolder.base64);
    if (this.isCropperDisabled) {
      this[imageType]= base64ToFile(this.gifImage)
      this.fileSelected.emit({
        [imageType]: this.convertBlobToFile(this[imageType], imageType === 'avatar' ? 'avatar' : 'cover'),
        [imageType === 'avatar' ? 'avatarImageHolder' : 'coverImageHolder']: this.gifImage
      })
    } else {
      this.fileSelected.emit({
        [imageType]: this.convertBlobToFile(this[imageType], imageType === 'avatar' ? 'avatar' : 'cover'),
        [imageType === 'avatar' ? 'avatarImageHolder' : 'coverImageHolder']: this.imageHolder.base64
      })
    }
    this.openImageCropper = false
    this.imageChangedEvent = null
  }

  fileChangeEvent(event: any, imageType: string): void {
    this.imageChangedEvent = event;
    console.log(this.imageChangedEvent)
    // console.log(event.target.file)
    this.openImageCropper = true
    this.ImageType = imageType
    console.log(this.ImageType)
    if (this.ImageType === 'cover') {
      this.resizeToWidth = 1920
      this.resizeToHeight = 700
      this.cropRatio = 96 / 35
    } else {
      this.resizeToWidth = 500
      this.resizeToHeight = 500
      this.cropRatio = 1
    }
  }
  openModal(type) {
    // this.imageChangedEvent = this.avatar
      this.openImageCropper = true
      this.ImageType = type


  }
  cancelUpload(){
    this.openImageCropper = false
    this.imageChangedEvent = null
  }
  removePhoto() {
    this.globalService.removeUserImage(this.ImageType).subscribe(res => {
      this.store.dispatch(new SetNotifications('Success' , 'Photo Removed Successfully' , 'success' ))
      this[this.ImageType] = res[this.ImageType]
      this.openImageCropper = false
      this.imageChangedEvent = null
    },error => {
      this.store.dispatch(new HandleError(error))
    })
  }
}
