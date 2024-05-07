import {Component, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {SwiperComponent, SwiperModule} from 'swiper/angular';

import SwiperCore, {
  SwiperOptions,
  A11y,
  EffectCoverflow,
  Lazy,
  Navigation,
  Pagination,
  Autoplay,

} from 'swiper';
import {NgFor, NgIf} from "@angular/common";
import {Router} from "@angular/router";

SwiperCore.use([A11y, EffectCoverflow, Lazy, Navigation, Pagination, Autoplay]);

@Component({
  selector: 'my-swiper',
  styleUrls: ['./my-swiper.component.scss'],
  templateUrl: './my-swiper.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    SwiperModule,
    NgIf,
    NgFor
  ],
  standalone: true
})
export class MySwiperComponent {
  @ViewChild(SwiperComponent) swiper: SwiperComponent;
  mobileView = false;
  tabletView: boolean = false;
  @Input() images: any;
  config: SwiperOptions;

  constructor(private router: Router) {
    setTimeout(() => {
      console.log(this.images)

    }, 3000)

    this.mobileView = window.screen.width < 550;
    this.config = {
      autoplay: {
        delay: 5000,
        disableOnInteraction: true,
      },
      navigation: !this.mobileView,
      centeredSlides: true,
      pagination: true,
      // pagination: {
      //   enabled: true,
      //   // bulletActiveClass: 'swiper-pagination-bullet-active',
      //   clickable: true,
      //   // bulletClass: 'swiper-pagination-bullet',
      //   progressbarFillClass: 'swiper-pagination-progressbar-fill',
      //   el: '.swiper-pagination',
      //   type: 'bullets',
      //   renderProgressbar: function (progressbarFillClass) {
      //     return '<span class="' + progressbarFillClass + '"></span>'; }
      // },

      // autoHeight: true,
      keyboard: true,
      slidesPerView: 'auto',
      shortSwipes: true,
      longSwipes: false,
      initialSlide: 0,
      grabCursor: false,
      spaceBetween: this.mobileView ? 20 : 60,
      effect: this.mobileView ? 'cards' : 'coverflow',
      loop: true,
      loopedSlides: 3,
      lazy: {loadPrevNextAmount: 0, loadPrevNext: true, enabled: true},
      watchSlidesProgress: true,
      coverflowEffect: {rotate: 0, scale: 1},
      speed: 300,
    };
  }

  swipePrev() {
    this.swiper.swiperRef.slidePrev();
  }

  swipeNext() {
    this.swiper.swiperRef.slideNext();
  }

  routeBanner(banner:any) {
    console.log(banner)
    if (banner.type == 'link') {
      window.location.href = banner.url
    } else {
      this.router.navigateByUrl('/' + banner.url)
    }
  }
}

