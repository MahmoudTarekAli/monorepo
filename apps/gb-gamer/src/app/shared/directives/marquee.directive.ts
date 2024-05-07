import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2, ChangeDetectorRef, AfterViewChecked, AfterViewInit
} from '@angular/core';
import {Observable} from "rxjs";

@Directive({
  selector: '[appMarquee]',
  standalone: true
})
export class MarqueeDirective implements AfterViewChecked, AfterViewInit {

  constructor(private elRef: ElementRef, private renderer: Renderer2) {
  }
  ngAfterViewInit() {
    // this.adjustHeight();
    this.centerText();

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

  @HostListener('window:resize')
  onResize() {
    // this.adjustHeight();
    this.centerText();
  }

  private adjustHeight() {
    const marqueeEl = this.elRef.nativeElement.firstElementChild;
    const containerEl = this.elRef.nativeElement;
    const marqueeHeight = containerEl.offsetHeight;
    if (containerEl.offsetHeight !== 0){
      this.renderer.setStyle(containerEl, 'height', `${marqueeHeight}px`);
    }

  }

  private centerText() {
    const marqueeEl = this.elRef.nativeElement.firstElementChild;
    const containerEl = this.elRef.nativeElement;

    // const marqueeHeight = containerEl.offsetHeight;
    const marqueeTextHeight = marqueeEl.offsetHeight;
    // console.log(marqueeHeight)
    //
    // const paddingTop = (marqueeHeight - marqueeTextHeight) / 2;
    // this.renderer.setStyle(containerEl, 'padding-top', `${paddingTop}px`);
  }
}
