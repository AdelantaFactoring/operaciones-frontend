import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { Menu } from 'app/shared/models/auth/user';

@Component({
  selector: '[core-menu]',
  templateUrl: './core-menu.component.html',
  styleUrls: ['./core-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreMenuComponent implements OnInit {
  currentUser: any;

  @Input()
  layout = 'vertical';

  @Input()
  menu: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {CoreMenuService} _coreMenuService
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _coreMenuService: CoreMenuService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the menu either from the input or from the service
    this.menu = this.menu || this._coreMenuService.getCurrentMenu();

    // Subscribe to the current menu changes
    this._coreMenuService.onMenuChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      //this.currentUser = this._coreMenuService.currentUser;
      this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

      // Load menu
      this._changeDetectorRef.markForCheck();
      this.onChangeMenu();
    });
  }

  onAcceso(menu: Menu[], idMenuL: number): boolean {
    return menu.filter(x => x.idMenu == idMenuL && x.acceso).length > 0;
  }

  onAccesoSeccion(menu: Menu[], nombreSeccion: string): boolean {
    return menu.filter(x => x.grupo == nombreSeccion.toUpperCase() && x.acceso).length > 0;
  }

  onChangeMenu(): void{
   if (this.currentUser != null) {
    for (const item of this.menu) {
      if (!this.onAccesoSeccion(this.currentUser.menu, item.title)) {
        item.type = '';
      }
      else{
        item.type = 'section';
      }
    }
   }
  }
}
