import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit, Renderer2,
  TemplateRef
} from '@angular/core';
import {NgStyle} from "@angular/common";
import {MarqueeDirective} from "../../directives/marquee.directive";

@Component({
  selector: 'app-marquee',
  templateUrl: './marquee.component.html',
  styleUrls: ['./marquee.component.scss'],
  imports: [
    NgStyle,
    MarqueeDirective
  ],
  standalone: true
})
export class MarqueeComponent implements OnInit {

  @Input() text: string
  @Input() marqueeStyle: any
  @Input() customTemp: TemplateRef<any>;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {
  }


  ngOnInit(): void {
  }

  mouseEnter() {
    const marqueeEl = this.elRef.nativeElement;
    console.log(marqueeEl.scrollWidth, marqueeEl.offsetWidth)
    if (marqueeEl.scrollWidth > marqueeEl.offsetWidth) {
      this.renderer.addClass(marqueeEl, 'marquee');
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    const marqueeEl = this.elRef.nativeElement;
    this.renderer.removeClass(marqueeEl, 'marquee');
  }
}
