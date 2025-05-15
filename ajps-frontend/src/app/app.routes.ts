import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { JournalsComponent } from './journals/journals.component';
import { ServicesComponent } from './services/services.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LoginComponent } from './login-register/login/login.component';
import { RegisterComponent } from './login-register/register/register.component';
import { RecoveryComponent } from './login-register/recovery/recovery.component';
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
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { PublisherViewComponent } from './site-settings/view/publisher-view/publisher-view.component';
import { JournalViewComponent } from './site-settings/view/journal-view/journal-view.component';
import { UserpanelViewComponent } from './site-settings/view/userpanel-view/userpanel-view.component';
import { ErrorpageViewComponent } from './site-settings/view/errorpage-view/errorpage-view.component';
import { UserSubmissionComponent } from './user/user-submission/user-submission.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserProfileEditComponent } from './user/user-profile-edit/user-profile-edit.component';
import { UserSettingsComponent } from './user/user-settings/user-settings.component';
import { EditorOverviewComponent } from './user/editor-overview/editor-overview.component';
import { EditorSubmissionsComponent } from './user/editor-submissions/editor-submissions.component';
import { EditorReviewersComponent } from './user/editor-reviewers/editor-reviewers.component';
import { EditorReportsComponent } from './user/editor-reports/editor-reports.component';
import { EditorJournalSettingsComponent } from './user/editor-journal-settings/editor-journal-settings.component';
import { InReviewComponent } from './user/user-submission/in-review/in-review.component';
import { DecisionQueueComponent } from './user/user-submission/decision-queue/decision-queue.component';

export const routes: Routes = [
    // publisher site:
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
            {path: 'recovery', component: RecoveryComponent, title: 'Recover Your Account - ScholarPress'},
        ]
    },
    // journal site:
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
            {path: ':issueNumber/:articleName', component: JournalArticlePageComponent, title: 'Article Page - ScholarPress'},
        ]        
    },
    // user site:
    {path: 'user', component: UserpanelViewComponent,
        children: [
            // general user:
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {path: 'dashboard', component: UserDashboardComponent, title: 'Dashboard - ScholarPress'},
            {path: 'submission', component: UserSubmissionComponent, title: 'Online Submission - ScholarPress'},
            {path: 'view-profile', component: UserProfileComponent, title: 'View Profile - ScholarPress'},
            {path: 'edit-profile', component: UserProfileEditComponent, title: 'Edit Profile - ScholarPress'},
            {path: 'settings', component: UserSettingsComponent, title: 'Profile Settings - ScholarPress'},
            // editorial panel:
            {path: 'journal-overview', component: EditorOverviewComponent, title: 'Journal Overview - ScholarPress'},
                // editorial submissions:
            {path: 'journal-submissions',
                children: [
                    {path: '', redirectTo: 'new-submissions', pathMatch: 'full'},
                    {path: 'new-submissions', component: EditorSubmissionsComponent, title: 'New Submissions - ScholarPress'},
                    {path: 'in-review', component: InReviewComponent, title: 'In Review - ScholarPress'},
                    {path: 'decision-queue', component: DecisionQueueComponent, title: 'Decision Queue - ScholarPress'},
                ]
            },
            {path: 'journal-reviewers', component: EditorReviewersComponent, title: 'Journal Reviewers - ScholarPress'},
            {path: 'journal-reports', component: EditorReportsComponent, title: 'Journal Reports - ScholarPress'},
            {path: 'journal-settings', component: EditorJournalSettingsComponent, title: 'Journal Settings - ScholarPress'},
        ]
    },
    // error page:
    {path: '**', component: ErrorpageViewComponent,
        children: [
            {path: '**', component: ErrorpageComponent, title: 'Page Not Found - ScholarPress'}
        ]
    }
];
