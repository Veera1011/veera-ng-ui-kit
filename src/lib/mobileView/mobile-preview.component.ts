import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  AfterViewInit,
  Output,
  ViewChild
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface PreviewDevice {
  id: string;
  name: string;
  width: number;
  height: number;
}

const DEFAULT_DEVICES: PreviewDevice[] = [
  { id: 'iphone14pro', name: 'iPhone 14 Pro', width: 393, height: 852 },
  { id: 'iphone11', name: 'iPhone 11', width: 414, height: 896 },
  { id: 'galaxys23', name: 'Galaxy S23', width: 360, height: 800 },
  { id: 'pixel7', name: 'Pixel 7', width: 412, height: 915 },
  { id: 'custom', name: 'Custom', width: 375, height: 667 },
];

@Component({
  selector: 'ui-mobile-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mobile-preview.component.html',
  styleUrls: ['./mobile-preview.component.scss']
})
export class MobilePreviewComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() devices: PreviewDevice[] = DEFAULT_DEVICES;

  @Input() set url(value: string | null) {
    this._url = value;
    this.updateSafeUrl();
  }
  get url(): string | null {
    return this._url;
  }

  /** Controls whether the component attempts full-screen mode on open */
  @Input() autoFullscreen = true;

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('stage') stageRef?: ElementRef<HTMLElement>;

  private _url: string | null = null;
  safeUrl: SafeResourceUrl | null = null;
  selectedDevice: PreviewDevice = DEFAULT_DEVICES[0];
  orientation: 'portrait' | 'landscape' = 'portrait';
  zoom = 100;
  showDeviceFrame = true;
  showStatusBar = true;
  showScrollIndicator = true;
  statusBarTime = '9:41';
  isFullscreen = false;

  private resizeObserver?: ResizeObserver;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.devices?.length) {
      this.selectedDevice = this.devices[0];
    }
    this.updateSafeUrl();
    this.updateStatusBarTime();
    this.opened.emit();
  }

  ngAfterViewInit(): void {
    if (this.stageRef?.nativeElement) {
      this.resizeObserver = new ResizeObserver(() => this.fitToScreen());
      this.resizeObserver.observe(this.stageRef.nativeElement);
    }
    
    // Auto-fit screen initial calculation
    setTimeout(() => this.fitToScreen(), 50);

    // Request fullscreen on load if enabled
    if (this.autoFullscreen) {
      this.requestFullscreen();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.closed.emit();
  }

  private updateSafeUrl(): void {
    const targetUrl = this.url ?? this.router.url;
    if (targetUrl) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(targetUrl);
    }
  }

  private updateStatusBarTime(): void {
    const now = new Date();
    this.statusBarTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  get frameWidth(): number {
    return this.orientation === 'portrait' ? this.selectedDevice.width : this.selectedDevice.height;
  }

  get frameHeight(): number {
    return this.orientation === 'portrait' ? this.selectedDevice.height : this.selectedDevice.width;
  }

  get outerWidth(): number {
    const pad = this.showDeviceFrame ? 24 : 0;
    return (this.frameWidth + pad) * (this.zoom / 100);
  }

  get outerHeight(): number {
    const pad = this.showDeviceFrame ? 24 : 0;
    return (this.frameHeight + pad) * (this.zoom / 100);
  }

  selectDevice(d: PreviewDevice): void {
    this.selectedDevice = d;
    this.fitToScreen();
  }

  setOrientation(o: 'portrait' | 'landscape'): void {
    this.orientation = o;
    this.fitToScreen();
  }

  rotate(): void {
    this.setOrientation(this.orientation === 'portrait' ? 'landscape' : 'portrait');
  }

  adjustZoom(delta: number): void {
    this.zoom = Math.min(150, Math.max(30, this.zoom + delta));
  }

  fitToScreen(): void {
    const stage = this.stageRef?.nativeElement;
    if (!stage) return;

    const availW = stage.clientWidth - 32;
    const availH = stage.clientHeight - 32;
    const framePad = this.showDeviceFrame ? 24 : 0;
    const w = this.frameWidth + framePad;
    const h = this.frameHeight + framePad;

    if (w <= 0 || h <= 0 || availW <= 0 || availH <= 0) return;

    const scale = Math.min(availW / w, availH / h, 1);
    this.zoom = Math.max(30, Math.round((scale * 100) / 5) * 5);
  }

  resetDefaults(): void {
    if (this.devices?.length) {
      this.selectedDevice = this.devices[0];
    }
    this.orientation = 'portrait';
    this.zoom = 100;
    this.showDeviceFrame = true;
    this.showStatusBar = true;
    this.showScrollIndicator = true;
    this.fitToScreen();
  }

  toggleFullscreen(): void {
    if (this.isFullscreen) {
      this.exitFullscreen();
    } else {
      this.requestFullscreen();
    }
  }

  private requestFullscreen(): void {
    const el = this.document.documentElement as any;
    const request = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    
    if (request) {
      request.call(el).then(() => {
        this.isFullscreen = true;
      }).catch((err: any) => {
        // User gesture security fallback
        console.warn('Auto-fullscreen was blocked by browser security guidelines:', err);
      });
    }
  }

  private exitFullscreen(): void {
    const doc = this.document as any;
    const exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    
    if (exit && doc.fullscreenElement) {
      exit.call(doc).then(() => {
        this.isFullscreen = false;
      }).catch(() => {});
    }
  }

  close(): void {
    if (this.isFullscreen) {
      this.exitFullscreen();
    }
    this.closed.emit();
  }

  @HostListener('document:fullscreenchange')
  @HostListener('document:webkitfullscreenchange')
  onFullscreenChange(): void {
    const doc = this.document as any;
    this.isFullscreen = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}