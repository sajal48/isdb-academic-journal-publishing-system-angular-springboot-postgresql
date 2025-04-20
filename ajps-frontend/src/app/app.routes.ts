import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    {path: 'home', pathMatch: 'full', component: HomepageComponent},

    {path: '**', component: ErrorpageComponent}
];
