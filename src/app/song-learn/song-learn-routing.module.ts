import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { SlPageSelectComponent } from './components/sl-page-select/sl-page-select.component';
import { SlPageLearnComponent } from './components/sl-page-learn/sl-page-learn.component';
import { MenuItem } from './interface';
import { IntroPageComponent } from './components/intro-page/intro-page.component';

export const MENU: MenuItem[] = [
  {
    path: 'intro',
    data: {
      name: 'Intro'
    },
    component: IntroPageComponent,
  },
  {
    path: 'page-select',
    data: {
      name: 'Search song'
    },
    component: SlPageSelectComponent,
  },
  {
    path: 'learn',
    data: {
      name: 'Learn song'
    },
    component: SlPageLearnComponent,
  },
];

const routes: Routes = [
  ...MENU,
  {
    path: 'learn/:id',
    data: {
      name: 'Learn song'
    },
    component: SlPageLearnComponent,
  },
  {
    path: '**',
    redirectTo: 'page-select'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class SongLearnRoutingModule {
}
