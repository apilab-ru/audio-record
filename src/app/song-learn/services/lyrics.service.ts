import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, ReplaySubject } from 'rxjs';
import { SpeechService } from './speech.service';
import { RecognitionService } from './recognition.service';
import { ALLOWABLE_ERROR_MIN_COUNT, ALLOWABLE_ERROR_PERCENTS, AUDIO_BEEP, Lang, SpeechSpeed } from '../const';
import { filter, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { AudioControlService } from './audio-control.service';
import { Song } from '../interface';
import { getCompleteObservable, runInZone } from '../helpers';
import { levenshtein } from './helpers';
import { COMMAND_SKIP } from '../consts/commands';
import { ToastrService } from 'ngx-toastr';

interface LyricsConfig {
  sayHitPercent: boolean;
  sayIntro: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LyricsService {
  currentSpeech$: Observable<string>;
  currentStep$: Observable<number>;
  isProgress$: Observable<boolean>;

  config: LyricsConfig = {
    sayHitPercent: false,
    sayIntro: false,
  };

  private allowableErrorPercents = ALLOWABLE_ERROR_PERCENTS;
  private allowableErrorMinCount = ALLOWABLE_ERROR_MIN_COUNT;

  private currentStep = new BehaviorSubject<number>(1);
  private isProgress = new BehaviorSubject<boolean>(false);
  private currentSong$ = new BehaviorSubject<Song | null>(null);

  constructor(
    private speechService: SpeechService,
    private recognitionService: RecognitionService,
    private audioControlService: AudioControlService,
    private ngZone: NgZone,
    private toastr: ToastrService,
  ) {
    this.currentSpeech$ = this.recognitionService.currentSpeech$;
    this.currentStep$ = this.currentStep.asObservable();
    this.isProgress$ = this.isProgress.asObservable();
    this.init();
  }

  start(): void {
    this.speechService.stop();
    this.recognitionService.stop();
    this.isProgress.next(true);
  }

  stop(): void {
    this.isProgress.next(false);
    this.speechService.stop();
  }

  setStep(step: number): void {
    this.speechService.stop();
    this.currentStep.next(step);
  }

  increaseStep(): void {
    const step = this.currentStep.getValue() + 1;
    if (step - 1 < this.currentSong$.getValue().translate?.length) {
      this.currentStep.next(step);
    }
  }

  decreaseStep(): void {
    const step = this.currentStep.getValue() - 1;
    if (step > 0) {
      this.currentStep.next(step);
    }
  }

  setSong(song: Song): void {
    this.currentSong$.next(song);
    this.currentStep.next(1);
    this.isProgress.next(false);
  }

  skip(): void {
    if (this.recognitionService.isRecognizing) {
      this.recognitionService.stop();
      this.increaseStep();
    } else {
      this.speechService.stop();
    }
  }

  private init(): void {
    combineLatest([
      this.currentSong$,
      this.isProgress$,
      this.currentStep$,
    ]).pipe(
      filter(([song]) => !!song),
      map(([song, isProgress, step]) => ({ song, isProgress, step })),
      runInZone(this.ngZone),
      switchMap(({ song, isProgress, step }) => !isProgress ? of(undefined) : this.iteration(song, step))
    ).subscribe();
  }

  private iteration(song: Song, step: number): Observable<void> {
    return this.speechService.say(song.original[step - 1], Lang.en, SpeechSpeed.slow).pipe(
      switchMap(() => {
        return this.speechService.say(song.translate[step - 1], Lang.ru, SpeechSpeed.normal);
      }),
      switchMap(() => this.checkAndTray(song, step)),
    );
  }

  private checkAndTray(song: Song, step: number, tryNumber = 1): Observable<void> {
    const line = this.clearLine(song.original[step - 1]);

    const say$ = ((step === 1 && tryNumber === 1 && this.config.sayIntro)
        ? this.speechService.say('Please tray to say after pik', Lang.en)
        : getCompleteObservable()
    );

    return say$.pipe(
      switchMap(() => this.speechService.say(line, Lang.en)),
      switchMap(() => this.audioControlService.play(AUDIO_BEEP)),
      tap(() => this.recognitionService.start()),
      runInZone(this.ngZone),
      switchMap(() => this.recognitionService.listening$),
      switchMap(speechRes => {
        const speech = this.clearLine(speechRes);
        this.recognitionService.stop();
        const diff = levenshtein(speech, line);
        const allowable = Math.max(
          Math.ceil(line.length * this.allowableErrorPercents / 100),
          this.allowableErrorMinCount,
        );

        if (COMMAND_SKIP === speech) {
          return this.speechService.say(`You skip step ${step}`).pipe(
            map(() => this.currentStep.next(step + 1)),
          );
        }

        if (diff > allowable) {
          this.toastr.error(`Try again, errors: ${diff} / ${allowable} `);
          return this.checkAndTray(song, step, tryNumber + 1);
        } else {
          const percent = Math.ceil((1 - +(diff / line.length).toFixed(2)) * 100);
          const score = Math.ceil(percent / 10);
          this.ngZone.run(() => {
            this.toastr.success('Success! You score: ' + score);
          });

          let sayComplete$: Observable<void>;
          if (this.config.sayHitPercent) {
            sayComplete$ = this.speechService.say(`Hit in ${percent} percent`);
          } else {
            sayComplete$ = getCompleteObservable();
          }

          return sayComplete$.pipe(
            runInZone(this.ngZone),
            map(() => this.currentStep.next(step + 1)),
          );
        }
      }),
    );
  }

  private clearLine(line: string): string {
    return line.replace(/([^A-Za-z\s']*)/g, '').trim();
  }

}
