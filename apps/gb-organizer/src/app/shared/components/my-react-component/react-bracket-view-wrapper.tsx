import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {DoubleElimination, SingleElimination} from './react-bracket-view';
import * as React from 'react';

import * as ReactDOM from 'react-dom';
import {BRACKET_TYPES} from "../../../core/tournament.enum";
import {Router} from "@angular/router";

const containerElementName = 'myReactComponentContainer';
window.React = React

@Component({
  selector: 'app-react-bracket-view-wrapper',
  template: `<span #${containerElementName}></span>`,
  encapsulation: ViewEncapsulation.None,
})

export class ReactBracketViewWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, {static: false}) containerRef: ElementRef;
  @Input() public matches: any;
  @Input() public rounds: any;
  @Input() public singleOrDouble: any;

  constructor(private router: Router) {
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    setTimeout(() => {
      this.render();
    }, 0);
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }

  private render() {
    if (this.matches) {
      console.log(this.matches)
      const navigateToMatchProfile = (data) => {
        this.router.navigateByUrl(`/match/${data.match.code}`)
      };
      if (this.singleOrDouble === BRACKET_TYPES.DOUBLE_ELIMINATION) {
        ReactDOM?.render(<div style={{overflow: "auto"}}>
          <DoubleElimination matches={this.matches} onData={navigateToMatchProfile}></DoubleElimination>
        </div>, this.containerRef.nativeElement);
      } else {
        ReactDOM?.render(<div style={{overflow: "auto"}}>
          <SingleElimination matches={this.matches} onData={navigateToMatchProfile}></SingleElimination>
        </div>, this.containerRef.nativeElement);
      }

    }
  }
}
