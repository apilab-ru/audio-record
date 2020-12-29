import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';

const DESKTOP_WIDTH = 1024;

@Injectable({
  providedIn: 'root',
})
export class BreakpointsService {
  public isMobile$: Observable<boolean>;
  public resize$: Observable<void>;

  constructor() {
    this.resize$ = fromEvent(window, 'resize').pipe(
      map(() => undefined),
      shareReplay(1),
    );
    this.isMobile$ = this.resize$.pipe(
      map(() => document.body.offsetWidth < DESKTOP_WIDTH),
      startWith(document.body.offsetWidth < DESKTOP_WIDTH),
      shareReplay(1),
    );
  }

  public isMobile(): boolean {
    return screen.width < DESKTOP_WIDTH;
  }
}
