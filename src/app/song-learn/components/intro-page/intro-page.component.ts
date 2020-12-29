import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ALLOWABLE_ERROR_MIN_COUNT, ALLOWABLE_ERROR_PERCENTS } from '../../const';

@Component({
  selector: 'sl-intro-page',
  templateUrl: './intro-page.component.html',
  styleUrls: ['./intro-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntroPageComponent {
  allowableErrorPercents = ALLOWABLE_ERROR_PERCENTS;
  allowableErrorMinCount = ALLOWABLE_ERROR_MIN_COUNT;
}
