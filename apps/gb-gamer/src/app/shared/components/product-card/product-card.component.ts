import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ]
})
export class ProductCardComponent implements OnInit {
    @Input() product: any;
    @Input() href: any;
    @Input() section;

    loaded = false;

    constructor() {
    }
    ngOnInit() {}
}
