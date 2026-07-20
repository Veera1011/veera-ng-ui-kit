import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MenuItem {
  label: string;
  icon?: string; // Material Symbol name
  value?: any;
  disabled?: boolean;
  checked?: boolean;
  shortcut?: string;
  children?: MenuItem[];
}
@Component({
  selector: 'ui-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ui-menu-trigger"
      (click)="toggle()"
      (contextmenu)="onContextMenu($event)"
    >
      <ng-content></ng-content>
    </div>

    <div
      *ngIf="opened"
      class="ui-menu-panel"
      [class.left]="placement === 'left'"
      [class.right]="placement === 'right'"
      [style.left.px]="contextMenu ? x : null"
      [style.top.px]="contextMenu ? y : null"
    >
      <ng-container
        *ngTemplateOutlet="
          menuTemplate;
          context: { $implicit: items }
        "
      ></ng-container>
    </div>

    <ng-template #menuTemplate let-menuItems>
      <div
        *ngFor="let item of menuItems"
        class="menu-item-wrapper"
        (mouseenter)="hoveredItem = item"
        (mouseleave)="hoveredItem = null"
      >
        <button
          class="ui-menu-item"
          [disabled]="item.disabled"
          (click)="onItemClick(item, $event)"
        >
          <!-- Checkbox -->

          <span class="menu-check">
            <span
              *ngIf="item.checked"
              class="material-symbols-rounded"
            >
              check
            </span>
          </span>

          <!-- Icon -->

          <span
            *ngIf="item.icon"
            class="material-symbols-rounded menu-icon"
          >
            {{ item.icon }}
          </span>

          <span class="menu-label">
            {{ item.label }}
          </span>

          <span
            *ngIf="item.shortcut"
            class="menu-shortcut"
          >
            {{ item.shortcut }}
          </span>

          <span
            *ngIf="item.children?.length"
            class="material-symbols-rounded submenu-arrow"
          >
            chevron_right
          </span>
        </button>

        <!-- SUBMENU -->

        <div
          *ngIf="
            hoveredItem === item &&
            item.children?.length
          "
          class="ui-submenu"
        >
          <ng-container
            *ngTemplateOutlet="
              menuTemplate;
              context: {
                $implicit: item.children
              }
            "
          ></ng-container>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    .ui-menu-trigger {
      display: inline-block;
    }

    .ui-menu-panel {
      position: absolute;
      min-width: 260px;
      padding: 6px;
      background: white;
      border-radius: 14px;
      border: 1px solid #e5e7eb;
      box-shadow:
        0 10px 30px rgba(0,0,0,.12);
      z-index: 1000;
      animation: menuIn .15s ease;
    }

    .menu-item-wrapper {
      position: relative;
    }

    .ui-menu-item {
      width: 100%;
      border: none;
      background: transparent;
      border-radius: 10px;
      padding: 11px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: .15s;
      text-align: left;
    }

    .ui-menu-item:hover:not(:disabled) {
      background: #f8fafc;
    }

    .ui-menu-item:disabled {
      opacity: .45;
      cursor: not-allowed;
    }

    .menu-check {
      width: 18px;
      display: flex;
      justify-content: center;
    }

    .menu-icon {
      font-size: 20px;
    }

    .menu-label {
      flex: 1;
      font-size: 14px;
    }

    .menu-shortcut {
      font-size: 12px;
      color: #9ca3af;
    }

    .submenu-arrow {
      font-size: 18px;
    }

    .ui-submenu {
      position: absolute;
      top: 0;
      left: calc(100% + 6px);

      min-width: 240px;
      background: white;
      border-radius: 14px;
      border: 1px solid #e5e7eb;
      padding: 6px;
      box-shadow:
        0 10px 30px rgba(0,0,0,.12);
    }

    .left .ui-submenu {
      left: auto;
      right: calc(100% + 6px);
    }

    @keyframes menuIn {
      from {
        opacity: 0;
        transform: translateY(-6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class MenuComponent {

  @Input()
  items: MenuItem[] = [];

  @Input()
  placement: 'left' | 'right' = 'right';

  @Input()
  contextMenu = false;

  @Output()
  itemClick =
    new EventEmitter<MenuItem>();

  opened = false;

  hoveredItem: MenuItem | null = null;

  x = 0;
  y = 0;

  toggle() {
    if (this.contextMenu) {
      return;
    }

    this.opened = !this.opened;
  }

  onItemClick(
    item: MenuItem,
    event: Event
  ) {
    event.stopPropagation();

    if (item.disabled) {
      return;
    }

    if (item.children?.length) {
      return;
    }

    this.itemClick.emit(item);
    this.opened = false;
  }

  onContextMenu(
    event: MouseEvent
  ) {
    if (!this.contextMenu) {
      return;
    }

    event.preventDefault();

    this.x = event.clientX;
    this.y = event.clientY;

    this.opened = true;
  }

  @HostListener('document:click')
  close() {
    this.opened = false;
  }

  @HostListener('click', ['$event'])
  stop(event: Event) {
    event.stopPropagation();
  }
}