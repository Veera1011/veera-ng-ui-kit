import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[uiTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('uiTooltip') text = '';

  private bubble: HTMLElement | null = null;

  constructor(private host: ElementRef<HTMLElement>, private renderer: Renderer2) {
    this.renderer.setStyle(this.host.nativeElement, 'position', 'relative');
    this.renderer.setStyle(this.host.nativeElement, 'display', 'inline-flex');
  }

  @HostListener('mouseenter')
  @HostListener('focus')
  show() {
    if (!this.text || this.bubble) return;
    const bubble = this.renderer.createElement('span');
    this.renderer.addClass(bubble, 'ui-tooltip-bubble');
    const textNode = this.renderer.createText(this.text);
    this.renderer.appendChild(bubble, textNode);
    this.renderer.setStyle(bubble, 'position', 'absolute');
    this.renderer.setStyle(bubble, 'bottom', 'calc(100% + 8px)');
    this.renderer.setStyle(bubble, 'left', '50%');
    this.renderer.setStyle(bubble, 'transform', 'translateX(-50%)');
    this.renderer.setStyle(bubble, 'background', 'var(--color-black)');
    this.renderer.setStyle(bubble, 'color', 'var(--color-white)');
    this.renderer.setStyle(bubble, 'font-size', 'var(--font-size-xs)');
    this.renderer.setStyle(bubble, 'padding', 'var(--space-2) var(--space-3)');
    this.renderer.setStyle(bubble, 'border-radius', 'var(--radius-sm)');
    this.renderer.setStyle(bubble, 'white-space', 'nowrap');
    this.renderer.setStyle(bubble, 'z-index', '50');
    this.renderer.setStyle(bubble, 'pointer-events', 'none');
    this.renderer.appendChild(this.host.nativeElement, bubble);
    this.bubble = bubble;
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  hide() {
    if (this.bubble) {
      this.renderer.removeChild(this.host.nativeElement, this.bubble);
      this.bubble = null;
    }
  }

  ngOnDestroy() {
    this.hide();
  }
}
