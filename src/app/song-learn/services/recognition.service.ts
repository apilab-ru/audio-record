import { Injectable, NgZone } from '@angular/core';
import { Lang } from '../const';
import { BehaviorSubject, Observable } from 'rxjs';

const SpeechRecognition = window.SpeechRecognition
  || window['webkitSpeechRecognition']
  || window['mozSpeechRecognition']
  || window['msSpeechRecognition'];

function isMobile(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

@Injectable({
  providedIn: 'root',
})
export class RecognitionService {
  public listening$: Observable<string>;

  private recognition: SpeechRecognition;
  private isRecognizing: boolean;
  private transcript: string;
  private currentSpeech = new BehaviorSubject<string | null>(null);

  public currentSpeech$ = this.currentSpeech.asObservable();

  constructor(
    private ngZone: NgZone,
  ) {
    this.recognition = new SpeechRecognition();
    this.recognition.lang = Lang.en;
    this.recognition.continuous = true;
    if (!isMobile()) {
      this.recognition.interimResults = true;
      this.recognition.start();
    }

    /*window.navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(() => {

      }).catch(() => {
        alert('Error');
    });*/

    this.isRecognizing = false;
    this.transcript = '';
    this.listening$ = this.getListening();
  }

  private getListening(): Observable<string> {
    return new Observable(subscribe => {
      this.do(result => {
        console.log('handler', result);
        subscribe.next(result);
      });
      return () => {
        console.log('un bind');
      };
    });
  }

  start(): void {
    try {
      this.recognition.start();
      this.isRecognizing = true;
    } catch (e) {
      alert('Recognition not working!');
      console.log('e', e);
    }
    console.log('Started recognition');
  }

  stop(): void {
    this.recognition.abort();
    this.isRecognizing = false;
    console.log('Stopped recognition');
  }

  private do(handler): void {
    this.transcript = '';
    this.recognition.onresult = (event) => {
      this.onResult(event, handler);
    };
  }

  private onResult(event, handler): void {
    const speech = event.results[event.results.length - 1][0].transcript;
    console.log('xxx speech', speech);
    this.ngZone.run(() => {
      this.currentSpeech.next(speech);
    });
    if (event.results[event.results.length - 1].isFinal) {
      handler(speech);
    }
  }
}
