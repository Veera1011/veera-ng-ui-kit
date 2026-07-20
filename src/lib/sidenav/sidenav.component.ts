import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SidenavItem {
  id: string;
  label: string;
  icon?: string;   // short text/emoji glyph, e.g. "▦"
  badge?: string;
}

export interface SidenavGroup {
  label?: string;
  items: SidenavItem[];
}

@Component({
  selector: 'ui-sidenav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="ui-sidenav" [class.is-collapsed]="collapsed()">
      
      <!-- TOP ACTION ACTION BAR LAYER -->
      <div class="ui-sidenav-topbar">
        <span class="ui-sidenav-brand" *ngIf="!collapsed()">Workspace</span>
        
        <!-- Toggle Collapse Button Control Trigger -->
        <button 
          type="button" 
          class="ui-sidenav-toggle" 
          (click)="toggleCollapse()"
          [attr.aria-label]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="ui-toggle-arrow">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- MAIN NAVIGATION LINKS SCROLL TRACK -->
      <div class="ui-sidenav-scroll-container">
        <ng-container *ngFor="let group of groups()">
          <div *ngIf="group.label && !collapsed()" class="ui-sidenav-group-label">
            {{ group.label }}
          </div>
          
          <button
            *ngFor="let item of group.items"
            type="button"
            class="ui-sidenav-item"
            [class.is-active]="item.id === activeId()"
            (click)="select(item.id)"
            [title]="collapsed() ? item.label : ''"
          >
            <span *ngIf="item.icon" class="ui-sidenav-icon">{{ item.icon }}</span>
            <span class="ui-sidenav-label" *ngIf="!collapsed()">{{ item.label }}</span>
            <span *ngIf="item.badge && !collapsed()" class="ui-sidenav-badge">{{ item.badge }}</span>
          </button>
        </ng-container>
      </div>

    </nav>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      --nav-bg: #ffffff;
      --nav-border: #e5e7eb;
      --nav-text: #4b5563;
      --nav-text-active: var(--color-primary-700, #1d4ed8);
      --nav-bg-active: var(--color-primary-50, #eff6ff);
    }

    .ui-sidenav {
      width: 240px;
      height: 100%;
      background: var(--nav-bg);
      border-right: 1px solid var(--nav-border);
      display: flex;
      flex-direction: column;
      transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Collapsed View State Adjustments */
    .ui-sidenav.is-collapsed {
      width: 68px;
    }

    /* Top Action Navigation Bar Wrapper */
    .ui-sidenav-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 52px;
      padding: 0 16px;
      border-bottom: 1px solid var(--nav-border);
    }
    .ui-sidenav.is-collapsed .ui-sidenav-topbar {
      justify-content: center;
      padding: 0;
    }

    .ui-sidenav-brand {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1f2937;
    }

    .ui-sidenav-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: 1px solid var(--nav-border);
      background: #ffffff;
      color: #6b7280;
      cursor: pointer;
      outline: none;
      transition: background 0.1s ease, transform 0.2s ease;
    }
    .ui-sidenav-toggle:hover {
      background: #f9fafb;
      color: #111827;
    }
    .ui-sidenav.is-collapsed .ui-toggle-arrow {
      transform: rotate(180deg);
    }

    /* Scroll Engine List Links Container */
    .ui-sidenav-scroll-container {
      flex: 1;
      overflow-y: auto;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ui-sidenav-group-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #9ca3af;
      padding: 14px 12px 6px;
      white-space: nowrap;
      overflow: hidden;
    }

    .ui-sidenav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 8px;
      color: var(--nav-text);
      font-size: 13.5px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      background: none;
      text-align: left;
      width: 100%;
      outline: none;
      transition: all 0.12s ease;
      white-space: nowrap;
    }
    .ui-sidenav-item:hover {
      background: #f4f4f5;
      color: #111827;
    }
    .ui-sidenav-item.is-active {
      background: var(--nav-bg-active);
      color: var(--nav-text-active);
      font-weight: 600;
    }

    .ui-sidenav-icon {
      font-size: 16px;
      width: 20px;
      flex-shrink: 0;
      text-align: center;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .is-active .ui-sidenav-icon {
      color: var(--color-primary-600, #2563eb);
    }

    .ui-sidenav-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ui-sidenav-badge {
      font-size: 11px;
      font-weight: 600;
      background: #e2e8f0;
      color: #334155;
      padding: 1px 6px;
      border-radius: 10px;
      line-height: 1.4;
    }
    .is-active .ui-sidenav-badge {
      background: var(--color-primary-600, #2563eb);
      color: #ffffff;
    }

    .ui-sidenav.is-collapsed .ui-sidenav-item {
      justify-content: center;
      padding: 10px 0;
    }
  `],
})
export class SidenavComponent {
  // Model and Inputs defined using the modern Angular Signals pattern
  groups = input<SidenavGroup[]>([]);
  activeId = model<string>('');
  collapsed = model<boolean>(false);

  collapsedChange = output<boolean>();

  select(id: string) {
    this.activeId.set(id);
  }

  toggleCollapse() {
    this.collapsed.update(c => !c);
    this.collapsedChange.emit(this.collapsed());
  }
}