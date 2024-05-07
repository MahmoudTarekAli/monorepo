import {
  Directive,
  ElementRef,
  Input,
  HostListener,
  OnInit,
  OnChanges,
  Renderer2,
  AfterViewInit,
  AfterContentInit, ChangeDetectorRef, SimpleChanges, AfterViewChecked
} from '@angular/core';
import {Select} from "@ngxs/store";
import {AuthenticationState} from "../../modules/authentication/state/authentication.state";
import {Observable} from "rxjs";

@Directive({
  selector: '[appMarquee]'
})
export class MarqueeDirective implements AfterViewChecked {

  constructor(private elRef: ElementRef, private renderer: Renderer2, private cdr: ChangeDetectorRef) {
  }

  ngAfterViewChecked() {
    const marqueeEl = this.elRef.nativeElement.firstElementChild;
    // console.log(marqueeEl)
    if (marqueeEl?.scrollWidth > marqueeEl?.offsetWidth) {
      this.renderer.setStyle(marqueeEl, 'text-overflow', 'ellipsis');
      this.renderer.setStyle(marqueeEl, 'white-space', 'nowrap');
    }
  }


  @HostListener('mouseenter') onMouseEnter() {
    const marqueeEl = this.elRef.nativeElement.firstElementChild;
    if (marqueeEl?.scrollWidth > marqueeEl?.offsetWidth) {
      this.renderer.addClass(marqueeEl, 'marquee');
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    const marqueeEl = this.elRef.nativeElement.firstElementChild;
    this.renderer.removeClass(marqueeEl, 'marquee');
  }


}
