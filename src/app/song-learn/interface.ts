import { Route } from '@angular/router';

export interface Song {
  id: number;
  name: string;
  artist: string;
  original: string[];
  translate: string[];
}

export interface MenuItem extends Route {
  data: {
    name: string;
  }
}
