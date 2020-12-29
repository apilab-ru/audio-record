import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MENU } from '../../song-learn-routing.module';

@Component({
  selector: 'sl-root',
  templateUrl: './sl-root.component.html',
  styleUrls: ['./sl-root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlRootComponent {
  menu = MENU;
}
