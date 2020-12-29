import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from '../../interface';
import { SongsListService } from '../../services/songs-list.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'sl-page-select',
  templateUrl: './sl-page-select.component.html',
  styleUrls: ['./sl-page-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlPageSelectComponent implements OnInit {
  public songs$: Observable<Song[]>;
  public search$: Observable<string>;

  private search = new BehaviorSubject<string>('');

  constructor(
    private songListService: SongsListService,
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

}
