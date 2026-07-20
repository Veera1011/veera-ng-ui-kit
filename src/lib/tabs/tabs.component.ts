import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
  id: string;
  label: string;
}

export type TabsVariant = 'underline' | 'pill';

@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-tabs" [ngClass]="'ui-tabs-' + variant" role="tablist">
      <button
        *ngFor="let tab of tabs"
        type="button"
        class="ui-tab"
        role="tab"
        [class.is-active]="tab.id === activeId"
        [attr.aria-selected]="tab.id === activeId"
        (click)="select(tab.id)"
      >{{ tab.label }}</button>
    </div>
  `,
  styles: [`
    .ui-tabs { display: flex; }
    .ui-tab {
      font-family: var(--font-family-body);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-gray-500);
      background: none;
      border: none;
      cursor: pointer;
      transition: color var(--motion-duration-base) var(--motion-ease-standard);
    }
    .ui-tab:hover { color: var(--color-black); }

    .ui-tabs-underline {
      border-bottom: var(--border-width-thin) solid var(--color-gray-200);
      gap: var(--space-6);
    }
    .ui-tabs-underline .ui-tab { padding: var(--space-3) var(--space-1); position: relative; }
    .ui-tabs-underline .ui-tab.is-active { color: var(--color-black); }
    .ui-tabs-underline .ui-tab.is-active::after {
      content: ""; position: absolute; left: 0; right: 0; bottom: -1px;
      height: 2px; background: var(--color-primary-500);
    }

    .ui-tabs-pill {
      background: var(--color-gray-100);
      border-radius: var(--radius-full);
      padding: var(--space-1);
      gap: var(--space-1);
      display: inline-flex;
    }
    .ui-tabs-pill .ui-tab { padding: var(--space-2) var(--space-4); border-radius: var(--radius-full); }
    .ui-tabs-pill .ui-tab.is-active { background: var(--color-white); color: var(--color-black); box-shadow: var(--shadow-xs); }
  `],
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeId = '';
  @Input() variant: TabsVariant = 'underline';
  @Output() activeIdChange = new EventEmitter<string>();

  select(id: string) {
    this.activeId = id;
    this.activeIdChange.emit(id);
  }
}
