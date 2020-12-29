import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SongsListService } from '../../services/songs-list.service';
import { Observable, of } from 'rxjs';
import { Song } from '../../interface';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'sl-page-learn',
  templateUrl: './sl-page-learn.component.html',
  styleUrls: ['./sl-page-learn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlPageLearnComponent implements OnInit {
  songs$: Observable<Song[]>;

  currentSongId$: Observable<number | null>;
  currentSong$: Observable<Song | null>;

  constructor(
    private songsListService: SongsListService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.songs$ = this.songsListService.songs$;
    this.currentSongId$ = this.activatedRoute.params.pipe(
      map(param => param?.id ? +param.id : null),
    );
    this.currentSong$ = this.currentSongId$.pipe(
      switchMap(id => !id ? of(null) : this.songsListService.getSong(id)),
    );
  }

  selectSong(songId: number): void {
    this.router.navigate(['./learn', songId]);
  }
}
