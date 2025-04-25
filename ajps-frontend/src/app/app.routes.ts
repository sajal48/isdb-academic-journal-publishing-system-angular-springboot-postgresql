import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { PublisherViewComponent } from './settings-views/publisher-view/publisher-view.component';
import { JournalsComponent } from './journals/journals.component';
import { ServicesComponent } from './services/services.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ContactpageComponent } from './contactpage/contactpage.component';

export const routes: Routes = [
    {
      path: '',
      component: PublisherViewComponent,
      children: [
        {
          path: '',
          redirectTo: 'home',
          pathMatch: 'full'
        },
        {
          path: 'home',
          component: HomepageComponent
        },
        {
          path: 'journals',
          component: JournalsComponent,
          children: [
            {
              path: '',
              // component: AllJournalsComponent
            },
            {
              path: ':journalName',
              component: ServicesComponent
            }
          ]
          
        },
        {
          path: 'services',
          component: ServicesComponent
        },
        {
          path: 'contact',
          component: ContactpageComponent
        },
        {
          path: 'login',
          component: LoginComponent
        },
        {
          path: 'register',
          component: RegisterComponent
        },
        {path: '**', component: ErrorpageComponent}
      ]
    },

    {path: '**', component: ErrorpageComponent}
];
