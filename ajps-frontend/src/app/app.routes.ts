import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { PublisherViewComponent } from './settings-views/publisher-view/publisher-view.component';
import { JournalsComponent } from './journals/journals.component';
import { ServicesComponent } from './services/services.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ContactpageComponent } from './contactpage/contactpage.component';
import { JournalViewComponent } from './settings-views/journal-view/journal-view.component';
import { JournalAllIssuesComponent } from './journals/journal-all-issues/journal-all-issues.component';
import { JournalAnnouncementComponent } from './journals/journal-announcement/journal-announcement.component';
import { JournalEditorialComponent } from './journals/journal-editorial/journal-editorial.component';
import { JournalArticleListComponent } from './journals/journal-article-list/journal-article-list.component';
import { JournalArticleViewComponent } from './journals/journal-article-view/journal-article-view.component';
import { RecoveryComponent } from './recovery/recovery.component';

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
          component: JournalsComponent
        },
        {
          path: 'journals/:journalName',
          component: JournalViewComponent,
          children: [
            {
              path: '',
              redirectTo: 'all-issues',
              pathMatch: 'full'
            },
            {
              path: 'all-issues',
              component: JournalAllIssuesComponent
            },
            {
              path: 'announcement',
              component: JournalAnnouncementComponent
            },
            {
              path: 'editorial-board',
              component: JournalEditorialComponent
            },
            {
              path: ':issueNumber',
              component: JournalArticleListComponent
            },
            {
              path: ':issueNumber/:articleName',
              component: JournalArticleViewComponent
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
        {
          path: 'recovery',
          component: RecoveryComponent
        },
        {path: '**', component: ErrorpageComponent}
      ]
    },

    {path: '**', component: ErrorpageComponent}
];
