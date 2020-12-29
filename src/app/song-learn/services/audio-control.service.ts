import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioControlService {
  private readonly audioNode: HTMLAudioElement;

  constructor() {
    this.audioNode = document.createElement('audio');
    document.body.append(this.audioNode);
  }

  play(src: string): Observable<void> {
    this.audioNode.src = src;
    return new Observable((resolve) => {
      this.audioNode.addEventListener('ended', () => {
        resolve.next();
        resolve.complete();
      });
      this.audioNode.play().catch(() => {
        resolve.error();
      });

      return () => {
        this.audioNode.pause();
      };
    });
  }
}
