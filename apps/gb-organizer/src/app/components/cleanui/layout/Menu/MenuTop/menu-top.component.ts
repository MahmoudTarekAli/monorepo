import {Component, OnInit} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {filter} from 'rxjs/operators';
import * as _ from 'lodash';
import { Select, Store } from '@ngxs/store'
;
import {MenuService} from 'src/app/services/menu';

@Component({
  selector: 'cui-menu-top',
  templateUrl: './menu-top.component.html',
  styleUrls: ['./menu-top.component.scss'],
})
export class MenuTopComponent implements OnInit {
  logo: String;
  menuColor: String;
  menuData: any[];
  menuDataActivated: any[];
  role: String;

  constructor(private menuService: MenuService, private store: Store,
              private router: Router) {
    this.store.select(state => state.setting).subscribe(state => {
      this.logo = state.logo;
      this.menuColor = state.menuColor;
    });
  }

  ngOnInit() {
    this.activateMenu(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.activateMenu(event.url ? event.url : null);
      });
  }

  activateMenu(url: any, menuData = this.menuData) {
    menuData = JSON.parse(JSON.stringify(menuData));
    const pathWithSelection = this.getPath({url: url}, menuData, (entry: any) => entry, 'url');
    if (pathWithSelection) {
      pathWithSelection.pop().selected = true;
      _.each(pathWithSelection, (parent: any) => (parent.open = true));
    }
    this.menuDataActivated = menuData.slice();
  }

  getPath(
    element: any,
    source: any,
    property: any,
    keyProperty = 'key',
    childrenProperty = 'children',
    path = [],
  ) {
    let found = false;
    const getElementChildren = (value: any) => _.get(value, childrenProperty);
    const getElementKey = (value: any) => _.get(value, keyProperty);
    const key = getElementKey(element);
    return (
      _.some(source, (e: any) => {
        if (getElementKey(e) === key) {
          path.push(e);
          return true;
        } else {
          return (found = this.getPath(
            element,
            getElementChildren(e),
            property,
            keyProperty,
            childrenProperty,
            path.concat(e),
          ));
        }
      }) &&
      (found || _.map(path, property))
    );
  }
}
