import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-modal-overlay" [class.is-open]="open" (click)="onOverlayClick($event)">
      <div class="ui-modal" *ngIf="open">
        <h3 *ngIf="title">{{ title }}</h3>
        <ng-content></ng-content>
        <div class="ui-modal-actions">
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ui-modal-overlay {
      position: fixed; inset: 0;
      background: rgba(20, 23, 28, 0.45);
      display: none;
      align-items: center; justify-content: center;
      z-index: 100;
      padding: var(--space-5);
    }
    .ui-modal-overlay.is-open { display: flex; }
    .ui-modal {
      background: var(--color-white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      max-width: 420px; width: 100%;
      padding: var(--space-6);
    }
    .ui-modal h3 { font-family: var(--font-family-display); font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); margin: 0 0 var(--space-3) 0; }
    .ui-modal-actions { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-5); }
  `],
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() closeOnOverlayClick = true;
  @Output() openChange = new EventEmitter<boolean>();

  onOverlayClick(event: Event) {
    if (this.closeOnOverlayClick && event.target === event.currentTarget) {
      this.open = false;
      this.openChange.emit(false);
    }
  }
}
