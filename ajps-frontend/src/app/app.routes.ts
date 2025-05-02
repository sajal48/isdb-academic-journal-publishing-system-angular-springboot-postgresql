import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { PublisherViewComponent } from './view-settings/publisher-view/publisher-view.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { JournalsComponent } from './journals/journals.component';
import { ServicesComponent } from './services/services.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LoginComponent } from './login-register/login/login.component';
import { RegisterComponent } from './login-register/register/register.component';
import { RecoveryComponent } from './login-register/recovery/recovery.component';
import { JournalViewComponent } from './view-settings/journal-view/journal-view.component';
import { JournalHomepageComponent } from './journals/journal-homepage/journal-homepage.component';
import { JournalEditorialBoardComponent } from './journals/journal-editorial-board/journal-editorial-board.component';
import { JournalCurrentIssueComponent } from './journals/journal-current-issue/journal-current-issue.component';
import { JournalAllIssuesComponent } from './journals/journal-all-issues/journal-all-issues.component';
import { JournalAnnouncementsComponent } from './journals/journal-announcements/journal-announcements.component';
import { JournalIndexingComponent } from './journals/journal-indexing/journal-indexing.component';
import { JournalProcessingChargeComponent } from './journals/journal-processing-charge/journal-processing-charge.component';
import { JournalSubmissionComponent } from './journals/journal-submission/journal-submission.component';
import { JournalIssueArticlesComponent } from './journals/journal-issue-articles/journal-issue-articles.component';
import { JournalArticlePageComponent } from './journals/journal-article-page/journal-article-page.component';

export const routes: Routes = [
    {path: '', component: PublisherViewComponent,
        children: [
            {path: '', redirectTo: 'home', pathMatch: 'full'},
            {path: 'home', component: HomepageComponent, title: 'Welcome - ScholarPress'},
            {path: 'about-us', component: AboutUsComponent, title: 'About Us - ScholarPress'},
            {path: 'journals', component: JournalsComponent, title: 'Our Journals - ScholarPress'},
            {path: 'services', component: ServicesComponent, title: 'Our Services - ScholarPress'},
            {path: 'contact-us', component: ContactUsComponent, title: 'Contact Us - ScholarPress'},
            {path: 'login', component: LoginComponent, title: 'Login to Your Account - ScholarPress'},
            {path: 'register', component: RegisterComponent, title: 'Create an Account - ScholarPress'},
            {path: 'recovery', component: RecoveryComponent, title: 'Recover Your Account - ScholarPress'}
        ]
    },
    {path: 'journals/:journalName', component: JournalViewComponent,
        children: [
            {path: '', redirectTo: 'homepage', pathMatch: 'full'},
            {path: 'homepage', component: JournalHomepageComponent, title: 'Homepage - ScholarPress'},
            {path: 'editorial-board', component: JournalEditorialBoardComponent, title: 'Editorial Board - ScholarPress'},
            {path: 'current-issue', component: JournalCurrentIssueComponent, title: 'Current Issue - ScholarPress'},
            {path: 'all-issues', component: JournalAllIssuesComponent, title: 'All Issues - ScholarPress'},
            {path: 'announcements', component: JournalAnnouncementsComponent, title: 'Announcements - ScholarPress'},
            {path: 'indexing', component: JournalIndexingComponent, title: 'Indexing - ScholarPress'},
            {path: 'processing-charge', component: JournalProcessingChargeComponent, title: 'Article Processing Charge - ScholarPress'},
            {path: 'online-submission', component: JournalSubmissionComponent, title: 'Online Submission - ScholarPress'},
            {path: ':issueNumber', component: JournalIssueArticlesComponent, title: 'Article List - ScholarPress'},
            {path: ':issueNumber/:articleName', component: JournalArticlePageComponent, title: 'Article Page - ScholarPress'}
        ]        
    },
    {path: '**', component: ErrorpageComponent, title: 'Page Not Found - ScholarPress'}
];
