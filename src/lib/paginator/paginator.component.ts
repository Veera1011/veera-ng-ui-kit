
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SelectComponent,
  SelectOption
} from '../select/select.component';

@Component({
  selector: 'ui-paginator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectComponent
  ],
  template: `
    <div class="ui-paginator">

      <div class="left-section">

        <div class="page-info">
          {{ startItem }} - {{ endItem }}
          of {{ length }}
        </div>

        <ui-select
          [options]="pageSizeSelectOptions"
          [value]="pageSize.toString()"
          (valueChange)="changePageSize($event)">
        </ui-select>

      </div>

      <div class="right-section">

        <!-- Mobile text -->
        <div class="mobile-info">
          {{ pageIndex + 1 }} / {{ totalPages }}
        </div>

        <!-- First -->
        <button
          class="page-btn"
          [disabled]="pageIndex === 0"
          (click)="goToPage(0)">
          «
        </button>

        <!-- Previous -->
        <button
          class="page-btn"
          [disabled]="pageIndex === 0"
          (click)="goToPage(pageIndex - 1)">
          ‹
        </button>

        <!-- Page Numbers -->
        <ng-container *ngFor="let page of visiblePages">

          <span
            *ngIf="page === -1"
            class="ellipsis">
            ...
          </span>

          <button
            *ngIf="page !== -1"
            class="page-btn"
            [class.active]="page === pageIndex"
            (click)="goToPage(page)">
            {{ page + 1 }}
          </button>

        </ng-container>

        <!-- Next -->
        <button
          class="page-btn"
          [disabled]="pageIndex >= totalPages - 1"
          (click)="goToPage(pageIndex + 1)">
          ›
        </button>

        <!-- Last -->
        <button
          class="page-btn"
          [disabled]="pageIndex >= totalPages - 1"
          (click)="goToPage(totalPages - 1)">
          »
        </button>

        <!-- Go to -->
        <div class="goto">

          <span>Go to</span>

          <input
            type="number"
            min="1"
            [max]="totalPages"
            [(ngModel)]="gotoPage">

          <button
            class="page-btn"
            (click)="goToInputPage()">
            Go
          </button>

        </div>

      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .ui-paginator {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      padding: 14px 18px;
      background: var(--color-white);
      border-top: 1px solid var(--color-gray-200);
      font-size: 14px;
    }

    .left-section,
    .right-section {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .page-info {
      color: var(--color-gray-600);
    }

    .page-btn {
      min-width: 36px;
      height: 36px;
      border: 1px solid var(--color-gray-200);
      background: var(--color-white);
      border-radius: 10px;
      cursor: pointer;
      transition: all .2s;
      font-size: 14px;
    }

    .page-btn:hover:not(:disabled) {
      border-color: var(--color-primary-500);
    }

    .page-btn.active {
      background: var(--color-primary-500);
      border-color: var(--color-primary-500);
      color: white;
      font-weight: 600;
    }

    .page-btn:disabled {
      opacity: .45;
      cursor: not-allowed;
    }

    .ellipsis {
      padding: 0 4px;
      color: var(--color-gray-500);
    }

    .goto {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .goto input {
      width: 70px;
      height: 36px;
      border: 1px solid var(--color-gray-200);
      border-radius: 10px;
      padding: 0 12px;
      outline: none;
    }

    .goto input:focus {
      border-color: var(--color-primary-500);
    }

    .mobile-info {
      display: none;
      color: var(--color-gray-600);
    }

    /* Dark Mode */
    :host-context(.dark) .ui-paginator {
      background: #1f2937;
      border-color: #374151;
    }

    :host-context(.dark) .page-btn,
    :host-context(.dark) .goto input {
      background: #111827;
      color: white;
      border-color: #374151;
    }

    :host-context(.dark) .page-info,
    :host-context(.dark) .mobile-info {
      color: #d1d5db;
    }

    /* Mobile */
    @media (max-width: 768px) {

      .page-info,
      .goto,
      .ellipsis {
        display: none;
      }

      .mobile-info {
        display: block;
      }

      .ui-paginator {
        justify-content: center;
      }
    }
  `]
})
export class PaginatorComponent
  implements OnChanges {

  @Input() length = 0;

  @Input() pageSize = 10;

  @Input() pageIndex = 0;

  @Input()
  pageSizeOptions = [5, 10, 20, 50];

  @Output()
  pageChange = new EventEmitter<{
    pageIndex: number;
    pageSize: number;
  }>();

  totalPages = 0;

  visiblePages: number[] = [];

  gotoPage = 1;

  ngOnChanges(
    changes: SimpleChanges
  ): void {
    this.buildPages();
  }

  get startItem(): number {
    if (!this.length) {
      return 0;
    }

    return (
      this.pageIndex * this.pageSize + 1
    );
  }

  get endItem(): number {
    return Math.min(
      (this.pageIndex + 1)
        * this.pageSize,
      this.length
    );
  }

  get pageSizeSelectOptions():
    SelectOption[] {

    return this.pageSizeOptions.map(
      x => ({
        label: `${x} / page`,
        value: x.toString()
      })
    );
  }

  buildPages() {

    this.totalPages = Math.ceil(
      this.length / this.pageSize
    );

    const pages: number[] = [];

    if (this.totalPages <= 7) {

      for (
        let i = 0;
        i < this.totalPages;
        i++
      ) {
        pages.push(i);
      }

    } else {

      pages.push(0);

      if (this.pageIndex > 2) {
        pages.push(-1);
      }

      const start =
        Math.max(
          1,
          this.pageIndex - 1
        );

      const end =
        Math.min(
          this.totalPages - 2,
          this.pageIndex + 1
        );

      for (
        let i = start;
        i <= end;
        i++
      ) {
        pages.push(i);
      }

      if (
        this.pageIndex
        < this.totalPages - 3
      ) {
        pages.push(-1);
      }

      pages.push(
        this.totalPages - 1
      );
    }

    this.visiblePages = pages;
  }

  goToPage(index: number) {

    if (
      index < 0 ||
      index >= this.totalPages
    ) {
      return;
    }

    this.pageIndex = index;
    this.gotoPage =
      this.pageIndex + 1;

    this.buildPages();

    this.emitPageChange();
  }

  goToInputPage() {
    this.goToPage(
      this.gotoPage - 1
    );
  }

  changePageSize(
    value: string
  ) {
    this.pageSize =
      Number(value);

    this.pageIndex = 0;
    this.gotoPage = 1;

    this.buildPages();

    this.emitPageChange();
  }

  private emitPageChange() {
    this.pageChange.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    });
  }
}

