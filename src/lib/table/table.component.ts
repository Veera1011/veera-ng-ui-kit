import { Component, computed, input, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  numeric?: boolean;   // Enables tabular-nums formatting
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortEvent {
  key: string;
  direction: SortDirection;
}

@Component({
  selector: 'ui-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-table-container">

      <!-- Premium Contextual floating active action drawer layer -->
      <div class="ui-table-action-banner" [class.ui-table-action-banner-active]="selectedCount() > 0">
        <div class="ui-banner-left">
          <span class="ui-banner-pulse"></span>
          <span class="ui-banner-count-text"><strong>{{ selectedCount() }}</strong> workspace entries selected</span>
        </div>
        <div class="ui-banner-right">
          <button type="button" class="ui-banner-btn secondary" (click)="clearSelection()">Deselect All</button>
          <button type="button" class="ui-banner-btn primary">Batch Action</button>
        </div>
      </div>

      <div class="ui-table-scroll-engine">
        <table class="ui-table">
          <thead>
            <tr>
              <th *ngIf="selectable()" class="ui-table-th-checkbox">
                <div 
                  class="ui-custom-checkbox" 
                  [class.is-indeterminate]="someSelected()" 
                  [class.is-checked]="allSelected()" 
                  (click)="toggleAll()"
                  (keydown.enter)="toggleAll()"
                  (keydown.space)="toggleAll(); $event.preventDefault()"
                  tabindex="0"
                  role="checkbox"
                  [attr.aria-checked]="allSelected() ? 'true' : (someSelected() ? 'mixed' : 'false')">
                  <svg *ngIf="allSelected()" width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span *ngIf="someSelected()" class="ui-checkbox-dash"></span>
                </div>
              </th>
              
              <th
                *ngFor="let col of columns()"
                [style.width]="col.width"
                [class.is-sortable]="col.sortable"
                [class.align-center]="col.align === 'center'"
                [class.align-right]="col.align === 'right' || col.numeric"
                (click)="col.sortable && onSort(col.key)"
                (keydown.enter)="col.sortable && onSort(col.key)"
                (keydown.space)="col.sortable && onSort(col.key); $event.preventDefault()"
                [attr.tabindex]="col.sortable ? '0' : null"
                [attr.aria-sort]="sortKey() === col.key ? (sortDirection() === 'asc' ? 'ascending' : 'descending') : null"
                role="columnheader"
              >
                <div class="ui-th-inner">
                  <span class="ui-th-txt">{{ col.label }}</span>
                  <div *ngIf="col.sortable" class="ui-sort-indicator" [class.is-active]="sortKey() === col.key">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      [class.dir-asc]="sortKey() === col.key && sortDirection() === 'asc'"
                      [class.dir-desc]="sortKey() === col.key && sortDirection() === 'desc'">
                      <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let row of sortedData(); let i = index"
              class="ui-table-tr"
              [class.ui-tr-striped]="striped() && i % 2 === 1"
              [class.ui-tr-selected]="isSelected(row)"
            >
              <td *ngIf="selectable()" class="ui-table-td-checkbox">
                <div 
                  class="ui-custom-checkbox" 
                  [class.is-checked]="isSelected(row)" 
                  (click)="toggleRow(row)"
                  (keydown.enter)="toggleRow(row)"
                  (keydown.space)="toggleRow(row); $event.preventDefault()"
                  tabindex="0"
                  role="checkbox"
                  [attr.aria-checked]="isSelected(row) ? 'true' : 'false'">
                  <svg *ngIf="isSelected(row)" width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </td>
              
              <td
                *ngFor="let col of columns()"
                [class.align-center]="col.align === 'center'"
                [class.align-right]="col.align === 'right' || col.numeric"
                [class.is-numeric]="col.numeric"
              >
                <span class="ui-cell-value-container">
                  {{ row[col.key] }}
                </span>
              </td>
            </tr>

            <!-- Pristine empty system state graphics layout interface fallback -->
            <tr *ngIf="sortedData().length === 0" class="ui-empty-row-layout">
              <td [attr.colspan]="columns().length + (selectable() ? 1 : 0)">
                <div class="ui-pristine-empty-state">
                  <div class="ui-empty-icon-shield">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h3>No operational data matched</h3>
                  <p>{{ emptyMessage() }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      --table-primary: var(--color-primary-600, #2563eb);
      --table-primary-light: var(--color-primary-50, #eff6ff);
      --table-border: #e4e7eb;
      --table-head-bg: #f8fafc;
      --table-text-main: #334155;
      --table-text-muted: #64748b;
    }

    .ui-table-container {
      position: relative;
      width: 100%;
      background: #ffffff;
      border: 1px solid var(--table-border);
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
      overflow: hidden;
    }

    /* Floating action overlay panel layer banner */
    .ui-table-action-banner {
      position: absolute;
      top: 0; left: 0; right: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 52px;
      padding: 0 20px;
      background: linear-gradient(90deg, #334155 0%, #1e293b 100%);
      color: #ffffff;
      transform: translateY(-100%);
      opacity: 0;
      transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease;
    }
    .ui-table-action-banner-active {
      transform: translateY(0);
      opacity: 1;
    }
    .ui-banner-left { display: flex; align-items: center; gap: 10px; }
    .ui-banner-pulse {
      width: 8px; height: 8px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulseAlert 1.6s infinite;
    }
    @keyframes pulseAlert {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .ui-banner-count-text { font-size: 13px; color: #e2e8f0; }
    .ui-banner-count-text strong { color: #ffffff; }
    
    .ui-banner-right { display: flex; align-items: center; gap: 8px; }
    .ui-banner-btn {
      font-size: 12px; font-weight: 600;
      padding: 6px 12px; border-radius: 6px;
      border: none; cursor: pointer; transition: all 0.1s ease;
    }
    .ui-banner-btn.secondary { background: transparent; color: #e2e8f0; }
    .ui-banner-btn.secondary:hover { color: #ffffff; background: rgba(255,255,255,0.08); }
    .ui-banner-btn.primary { background: var(--table-primary); color: white; }
    .ui-banner-btn.primary:hover { filter: brightness(1.1); }

    /* Core table interface mapping layouts */
    .ui-table-scroll-engine { width: 100%; overflow-x: auto; }
    .ui-table { width: 100%; border-collapse: collapse; text-align: left; }

    /* Exquisite headers system definitions styles options */
    thead th {
      background-color: var(--table-head-bg);
      padding: 14px 18px;
      font-size: 11px; font-weight: 600;
      letter-spacing: 0.05em; text-transform: uppercase;
      color: var(--table-text-muted);
      border-bottom: 1px solid #e2e8f0;
      white-space: nowrap; user-select: none;
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .is-sortable { cursor: pointer; outline: none; }
    .is-sortable:hover { background-color: #f1f5f9; color: #1e293b; }
    .is-sortable:focus-visible { background-color: #e2e8f0; }
    
    .ui-th-inner { display: inline-flex; align-items: center; gap: 6px; }
    .ui-sort-indicator { 
      display: inline-flex; align-items: center; color: #cbd5e1;
      transition: color 0.15s ease; 
    }
    .ui-sort-indicator svg { 
      transition: transform 0.2s ease, color 0.15s ease; 
      transform: rotate(0deg);
    }
    .is-sortable:hover .ui-sort-indicator { color: #94a3b8; }
    .ui-sort-indicator.is-active { color: var(--table-primary); }
    .ui-sort-indicator svg.dir-asc { transform: rotate(180deg); }

    /* Row operations and dynamic status mappings layouts */
    tbody tr.ui-table-tr {
      border-bottom: 1px solid var(--table-border);
      transition: background-color 0.1s ease, box-shadow 0.1s ease;
    }
    tbody tr.ui-table-tr:last-child { border-bottom: none; }
    
    tbody td {
      padding: 14px 18px;
      font-size: 13.5px;
      color: var(--table-text-main);
      white-space: nowrap;
    }

    .ui-tr-striped { background-color: #f8fafc; }
    .ui-table-tr:hover { background-color: #f1f5f9 !important; }
    
    /* Modern structural selected rows layout visual system state metrics */
    .ui-tr-selected, .ui-tr-selected:hover {
      background-color: var(--table-primary-light) !important;
    }
    .ui-tr-selected td { color: var(--color-primary-900, #1e3a8a); }

    /* Accessible structural checkboxes controls engine values */
    .ui-table-th-checkbox, .ui-table-td-checkbox { width: 48px; padding-right: 0; }
    .ui-custom-checkbox {
      display: inline-flex; align-items: center; justify-content: center;
      width: 16px; height: 16px; border-radius: 4px;
      border: 1.5px solid #cbd5e1; background: #ffffff;
      cursor: pointer; outline: none; transition: all 0.1s ease;
    }
    .ui-custom-checkbox:hover { border-color: #94a3b8; }
    .ui-custom-checkbox:focus-visible { box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2); }
    .is-checked, .is-indeterminate {
      background: var(--table-primary);
      border-color: var(--table-primary) !important;
    }
    .ui-checkbox-dash { width: 8px; height: 2px; background: white; border-radius: 1px; }

    /* Utility data alignments configurations properties setup classes */
    .align-center { text-align: center; }
    .align-center .ui-th-inner { justify-content: center; width: 100%; }
    .align-right { text-align: right; }
    .align-right .ui-th-inner { flex-direction: row-reverse; }
    .is-numeric { font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }

    /* Elevated system components graphics empty state layouts layers */
    .ui-empty-row-layout td { padding: 0; }
    .ui-pristine-empty-state {
      display: flex; flex-direction: column; align-items: center;
      padding: 56px 24px; text-align: center; background: #ffffff;
    }
    .ui-empty-icon-shield {
      display: inline-flex; align-items: center; justify-content: center;
      width: 48px; height: 48px; border-radius: 50%;
      background: #f1f5f9; color: #94a3b8; margin-bottom: 12px;
    }
    .ui-pristine-empty-state h3 {
      font-size: 14px; font-weight: 600; color: var(--table-text-main); margin: 0 0 4px 0;
    }
    .ui-pristine-empty-state p {
      font-size: 13px; color: var(--table-text-muted); margin: 0;
    }
  `],
})
export class DataTableComponent {
  columns = input<TableColumn[]>([]);
  data = input<any[]>([]);
  selectable = input<boolean>(false);
  striped = input<boolean>(false);
  rowKey = input<string>('id');
  emptyMessage = input<string>('No data match available in this specific directory');

  selectionChange = output<any[]>();
  sortChange = output<SortEvent>();

  sortKey = signal<string | null>(null);
  sortDirection = signal<SortDirection>(null);
  selectedKeysSet = signal<Set<any>>(new Set<any>());

  selectedCount = computed(() => this.selectedKeysSet().size);

  sortedData = computed(() => {
    const rawData = this.data();
    const key = this.sortKey();
    const direction = this.sortDirection();

    if (!key || !direction || !rawData) return rawData || [];
    
    const dir = direction === 'asc' ? 1 : -1;
    return [...rawData].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  });

  allSelected = computed(() => {
    const rawData = this.data();
    if (!rawData || rawData.length === 0) return false;
    const currentSet = this.selectedKeysSet();
    const key = this.rowKey();
    return rawData.every(row => currentSet.has(row[key]));
  });

  someSelected = computed(() => {
    return this.selectedCount() > 0 && !this.allSelected();
  });

  onSort(key: string) {
    if (this.sortKey() !== key) {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    } else if (this.sortDirection() === 'asc') {
      this.sortDirection.set('desc');
    } else {
      this.sortKey.set(null);
      this.sortDirection.set(null);
    }
    this.sortChange.emit({ key, direction: this.sortDirection() });
  }

  isSelected(row: any): boolean {
    return this.selectedKeysSet().has(row[this.rowKey()]);
  }

  toggleRow(row: any) {
    const key = row[this.rowKey()];
    const newSet = new Set(this.selectedKeysSet());
    newSet.has(key) ? newSet.delete(key) : newSet.add(key);
    
    this.selectedKeysSet.set(newSet);
    this.emitSelection();
  }

  toggleAll() {
    const newSet = new Set<any>();
    if (!this.allSelected()) {
      const key = this.rowKey();
      this.data().forEach(row => newSet.add(row[key]));
    }
    this.selectedKeysSet.set(newSet);
    this.emitSelection();
  }

  clearSelection() {
    this.selectedKeysSet.set(new Set<any>());
    this.emitSelection();
  }

  private emitSelection() {
    const key = this.rowKey();
    const currentSet = this.selectedKeysSet();
    this.selectionChange.emit(this.data().filter(row => currentSet.has(row[key])));
  }
}