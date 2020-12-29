import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlPageLearnComponent } from './components/sl-page-learn/sl-page-learn.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SlPageSelectComponent } from './components/sl-page-select/sl-page-select.component';
import { SlRootComponent } from './components/sl-root/sl-root.component';
import { SongLearnRoutingModule } from './song-learn-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SongProgressComponent } from './components/song-progress/song-progress.component';
import { IntroPageComponent } from './components/intro-page/intro-page.component';


@NgModule({
  declarations: [
    SlPageLearnComponent,
    SlPageSelectComponent,
    SlRootComponent,
    SongProgressComponent,
    IntroPageComponent,
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
    MatCheckboxModule,
    SongLearnRoutingModule,
  ],
  exports: [
    SlRootComponent,
  ]
})
export class SongLearnModule { }
