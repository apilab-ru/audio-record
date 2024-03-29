import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from '../../interface';
import { SongsListService } from '../../services/songs-list.service';
import { switchMap } from 'rxjs/operators';
import { BreakpointsService } from '../../services/breakpoints.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sl-page-select',
  templateUrl: './sl-page-select.component.html',
  styleUrls: ['./sl-page-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlPageSelectComponent implements OnInit {
  public songs$: Observable<Song[]>;
  public search$: Observable<string>;
  currentSong$ = new BehaviorSubject<Song | null>(null);

  private search = new BehaviorSubject<string>('');

  constructor(
    private songListService: SongsListService,
    private breakpointsService: BreakpointsService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.search$ = this.search.asObservable();
    this.songs$ = this.search$.pipe(
      switchMap(search => this.songListService.getListByFilter(search))
    );
  }

  onFilterChange(search: string): void {
    this.search.next(search);
  }

  selectSong(song: Song): void {
    if (this.breakpointsService.isMobile()) {
      this.router.navigate(['./learn', song.id]);
    } else {
      this.currentSong$.next(song);
    }
  }

}
