import { Subject, Observable } from 'rxjs';

export class DialogRef<R = any> {
  private _afterClosed = new Subject<R | undefined>();

  constructor(private _destroy: (result?: R) => void) {}

  /** Call from inside your dialog content component to close it. */
  close(result?: R) {
    this._destroy(result);
  }

  /** Subscribe to get the result once the dialog closes. */
  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }

  /** @internal called by DialogService once teardown starts */
  _emitClosed(result?: R) {
    this._afterClosed.next(result);
    this._afterClosed.complete();
  }
}