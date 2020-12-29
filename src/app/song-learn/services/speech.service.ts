import { Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Lang, SpeechSpeed } from '../const';
import { runInZone } from '../helpers';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  constructor(
    private ngZone: NgZone,
  ) {
  }

  say(message: string, lang: Lang = Lang.en, speed: SpeechSpeed = SpeechSpeed.slow): Observable<void> {
    const speaker = new SpeechSynthesisUtterance();
    speaker.lang = lang;
    speaker.rate = speed;
    speaker.text = message;

    return new Observable<void>(subject => {
      speaker.onend = () => {
        subject.next();
        subject.complete();
      };
      window.speechSynthesis.speak(speaker);

      return () => {
        console.log('xxx stop', message);
        // this.stop();
      };
    }).pipe(runInZone(this.ngZone));
  }

  stop(): Observable<void> {
    return of(window.speechSynthesis.cancel());
  }
}
