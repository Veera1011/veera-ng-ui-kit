import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-dropdown" [class.is-open]="isOpen">
      <div (click)="toggle($event)">
        <ng-content select="[trigger]"></ng-content>
      </div>
      <div class="ui-dropdown-menu" *ngIf="isOpen">
        <ng-content select="[menu]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .ui-dropdown { position: relative; display: inline-block; }
    .ui-dropdown-menu {
      position: absolute; top: calc(100% + var(--space-2)); left: 0;
      min-width: 200px;
      background: var(--color-white);
      border: var(--border-width-thin) solid var(--color-gray-200);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      padding: var(--space-2);
      z-index: 20;
    }
  `],
})
export class DropdownComponent {
  @Input() isOpen = false;

  constructor(private elementRef: ElementRef) {}

  toggle(event: Event) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
