import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="ui-avatar" [ngClass]="'ui-avatar-' + size">
      <img *ngIf="src" [src]="src" [alt]="name" (error)="src = null">
      <span *ngIf="!src" class="ui-avatar-initials">{{ initials }}</span>
      <span *ngIf="status" class="ui-avatar-status" [ngClass]="'ui-avatar-status-' + status"></span>
    </span>
  `,
  styles: [`
    .ui-avatar {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: var(--color-primary-100);
      color: var(--color-primary-700);
      font-family: var(--font-family-body);
      font-weight: var(--font-weight-semibold);
      overflow: hidden;
      flex-shrink: 0;
    }
    .ui-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

    .ui-avatar-sm { width: 28px; height: 28px; font-size: var(--font-size-xs); }
    .ui-avatar-md { width: 40px; height: 40px; font-size: var(--font-size-sm); }
    .ui-avatar-lg { width: 56px; height: 56px; font-size: var(--font-size-md); }

    .ui-avatar-status {
      position: absolute; right: 0; bottom: 0;
      width: 28%; height: 28%; min-width: 8px; min-height: 8px;
      border-radius: 999px;
      border: 2px solid var(--color-white);
    }
    .ui-avatar-status-online { background: var(--color-semantic-success); }
    .ui-avatar-status-away { background: var(--color-semantic-warning); }
    .ui-avatar-status-offline { background: var(--color-gray-300); }
  `],
})
export class AvatarComponent {
  @Input() src: string | null = null;
  @Input() name = '';
  @Input() size: AvatarSize = 'md';
  @Input() status: 'online' | 'away' | 'offline' | '' = '';

  get initials(): string {
    if (!this.name) return '?';
    const parts = this.name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }
}
