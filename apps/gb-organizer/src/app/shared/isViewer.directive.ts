import {AfterViewInit, Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appIsViewer]'
})
export class IsViewerDirective implements OnInit, AfterViewInit {
  isAuthorized: boolean;
  role: any;
  @Input() text: any;

  constructor(private elementRef: ElementRef) {

  }

  ngOnInit(): void {
     this.role = localStorage.getItem('user-role');
  }

  ngAfterViewInit(): void {
    if (this.role === 'viewer') {
      this.elementRef.nativeElement.style.display = 'none';
    } else {
      this.elementRef.nativeElement.style.textAlign = 'block';
    }
  }
}
