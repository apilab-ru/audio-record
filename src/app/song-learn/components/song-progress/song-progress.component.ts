import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Song } from '../../interface';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AudioControlService } from '../../services/audio-control.service';
import { LyricsService } from '../../services/lyrics.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'sl-song-progress',
  templateUrl: './song-progress.component.html',
  styleUrls: ['./song-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongProgressComponent implements OnInit, OnChanges, OnDestroy {
  @Input() currentSong: Song;

  currentStep$: Observable<number>;
  currentLine$: Observable<string>;
  isProgress$: Observable<boolean>;
  currentSpeech$: Observable<string>;
  progressPercents$: Observable<number>;
  formConfig: FormGroup;

  private currentSong$ = new ReplaySubject<Song>(1);

  constructor(
    private audioControlService: AudioControlService,
    private lyricsService: LyricsService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.formConfig = this.fb.group({
      ...this.lyricsService.config
    });
    this.formConfig.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(config => this.lyricsService.config = config);

    this.currentStep$ = this.lyricsService.currentStep$;
    this.currentSpeech$ = this.lyricsService.currentSpeech$;
    this.isProgress$ = this.lyricsService.isProgress$;
    this.currentLine$ = combineLatest(
      this.currentSong$,
      this.currentStep$,
    ).pipe(
      map(([song, step]) => song ? song.original[step - 1] : null),
    );

    this.currentSpeech$ = this.lyricsService.currentSpeech$;
    this.progressPercents$ = combineLatest(
      this.currentStep$,
      this.currentSong$
    ).pipe(
      map(([step, song]) => song ? (step / song.original.length) * 100  : 0)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentSong) {
      this.currentSong$.next(this.currentSong);
      this.lyricsService.setSong(this.currentSong);
    }
  }

  ngOnDestroy(): void {
    this.lyricsService.stop();
  }

  onUpdateStep(step: string): void {
    this.lyricsService.setStep(+step);
  }

  start(): void {
    this.lyricsService.start();
  }

  pause(): void {
    this.lyricsService.stop();
  }

  increaseStep(): void {
    this.lyricsService.increaseStep();
  }

  decreaseStep(): void {
    this.lyricsService.decreaseStep();
  }
}
