import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Song } from '../interface';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SongsListService {
  public songs$: Observable<Song[]>;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.songs$ = this.loadSongs().pipe(shareReplay(1));
  }

  getListByFilter(search: string): Observable<Song[]> {
    return this.songs$.pipe(
      map(list => !search ? list : list.filter(item => {
        return item.name.includes(search) || item.artist.includes(search)
      }))
    );
  }

  getSong(id: number): Observable<Song> {
    return this.songs$.pipe(
      take(1),
      map(list => list.find(it => it.id === id)),
    );
  }

  private loadSongs(): Observable<Song[]> {
    return this.httpClient.get<Song[]>('./assets/songs/songs.json');
  }
}
