import { ExtraOptions, Routes } from '@angular/router';
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
import { InReviewComponent } from './user/editor-submissions/in-review/in-review.component';
import { DecisionQueueComponent } from './user/editor-submissions/decision-queue/decision-queue.component';
import { EditorEditorialBoardComponent } from './user/editor-editorial-board/editor-editorial-board.component';
import { ReviewerDashboardComponent } from './user/reviewer-dashboard/reviewer-dashboard.component';
import { ReviewerAssignedManuscriptsComponent } from './user/reviewer-assigned-manuscripts/reviewer-assigned-manuscripts.component';
import { ReviewerSubmittedReviewsComponent } from './user/reviewer-submitted-reviews/reviewer-submitted-reviews.component';
import { AdminDashboardComponent } from './user/admin-dashboard/admin-dashboard.component';
import { AdminJournalPublicationComponent } from './user/admin-journal-publication/admin-journal-publication.component';
import { AdminUserSubmissionsComponent } from './user/admin-user-submissions/admin-user-submissions.component';
import { AdminJournalManagementComponent } from './user/admin-journal-management/admin-journal-management.component';
import { AdminEditorialManagementComponent } from './user/admin-editorial-management/admin-editorial-management.component';
import { AdminReviewerManagementComponent } from './user/admin-reviewer-management/admin-reviewer-management.component';
import { AdminUserManagementComponent } from './user/admin-user-management/admin-user-management.component';
import { AdminActivityLogsComponent } from './user/admin-activity-logs/admin-activity-logs.component';
import { SubmissionStepOneComponent } from './user/user-submission/submission-step-one/submission-step-one.component';
import { SubmissionStepTwoComponent } from './user/user-submission/submission-step-two/submission-step-two.component';
import { SubmissionStepThreeComponent } from './user/user-submission/submission-step-three/submission-step-three.component';
import { SubmissionStepFiveComponent } from './user/user-submission/submission-step-five/submission-step-five.component';
import { SubmissionStepFourComponent } from './user/user-submission/submission-step-four/submission-step-four.component';
import { SubmissionStepSixComponent } from './user/user-submission/submission-step-six/submission-step-six.component';
import { SubmissionViewComponent } from './user/user-submission/submission-view/submission-view.component';
import { authGuardUserGuard } from './site-settings/auth/auth-guard-user.guard';
import { UserPaymentsComponent } from './user/user-payments/user-payments.component';
import { AdminSiteSettingsComponent } from './user/admin-site-settings/admin-site-settings.component';

export const routes: Routes = [
    // publisher site:
    {path: '', component: PublisherViewComponent,
        children: [
            {path: '', redirectTo: 'home', pathMatch: 'full'},
            {path: 'home', component: HomepageComponent, title: 'Welcome - ScholarPress'},
            {path: 'about-us', component: AboutUsComponent, title: 'About Us - ScholarPress'},
            {path: 'journal', component: JournalsComponent, title: 'Our Journals - ScholarPress'},
            {path: 'services', component: ServicesComponent, title: 'Our Services - ScholarPress'},
            {path: 'contact-us', component: ContactUsComponent, title: 'Contact Us - ScholarPress'},
            {path: 'login', component: LoginComponent, title: 'Login to Your Account - ScholarPress'},
            {path: 'register', component: RegisterComponent, title: 'Create an Account - ScholarPress'},
            {path: 'recovery', component: RecoveryComponent, title: 'Recover Your Account - ScholarPress'},
        ]
    },
    // journal site:
    {path: 'journal/:journalName', component: JournalViewComponent,    
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
            {path: ':issueNumber/article/:articleNumber', component: JournalArticlePageComponent, title: 'Article Page - ScholarPress'},
        ]        
    },
    // user site:
    {path: 'user', component: UserpanelViewComponent,
        canActivate: [authGuardUserGuard],
        data: {roles: ['user','editor','reviewer','admin']},
        children: [
            // general user:
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {path: 'dashboard', component: UserDashboardComponent, canActivate: [authGuardUserGuard], data: {roles: ['user','editor','reviewer','admin']}, title: 'Dashboard - ScholarPress'},
            {path: 'submission', component: UserSubmissionComponent,
                canActivate: [authGuardUserGuard], 
                data: {roles: ['user','editor','reviewer','admin']},
                children: [
                    {path: '', redirectTo: 'manuscript-details', pathMatch: 'full'},
                    {path: 'manuscript-details', component: SubmissionStepOneComponent, title: 'Manuscript Details Submission - ScholarPress'},
                    {path: 'author-informations', component: SubmissionStepTwoComponent, title: 'Author Informations Submission - ScholarPress'},
                    {path: 'manuscript-upload', component: SubmissionStepThreeComponent, title: 'Manuscript File Submission - ScholarPress'},
                    {path: 'suggested-reviewers', component: SubmissionStepFourComponent, title: 'Suggested Reviewers Submission - ScholarPress'},
                    {path: 'additional-informations', component: SubmissionStepFiveComponent, title: 'Additional Information Submission - ScholarPress'},
                    {path: 'submission-confirmation', component: SubmissionStepSixComponent, title: 'Article Confirmation Submission - ScholarPress'},
                    {path: 'submission-view', component: SubmissionViewComponent, title: 'View Article Submission - ScholarPress'},
                ]
            },
            {path: 'view-profile', component: UserProfileComponent, canActivate: [authGuardUserGuard], data: {roles: ['user','editor','reviewer','admin']}, title: 'View Profile - ScholarPress'},
            {path: 'edit-profile', component: UserProfileEditComponent, canActivate: [authGuardUserGuard], data: {roles: ['user','editor','reviewer','admin']}, title: 'Edit Profile - ScholarPress'},
            {path: 'settings', component: UserSettingsComponent, canActivate: [authGuardUserGuard], data: {roles: ['user','editor','reviewer','admin']}, title: 'Profile Settings - ScholarPress'},
            {path: 'payments', component: UserPaymentsComponent, canActivate: [authGuardUserGuard], data: {roles: ['user','editor','reviewer','admin']}, title: 'Payments - ScholarPress'},
            
            // editorial panel:
            {path: 'journal-overview', component: EditorOverviewComponent, canActivate: [authGuardUserGuard], data: {roles: ['editor']}, title: 'Journal Overview - ScholarPress'},
            {path: 'journal-submissions',
                canActivate: [authGuardUserGuard], 
                data: {roles: ['editor']},
                children: [
                    {path: '', redirectTo: 'new-submissions', pathMatch: 'full'},
                    {path: 'new-submissions', component: EditorSubmissionsComponent, title: 'New Submissions - ScholarPress'},
                    {path: 'under-review', component: InReviewComponent, title: 'Under Review - ScholarPress'},
                    {path: 'decision-queue', component: DecisionQueueComponent, title: 'Decision Queue - ScholarPress'},
                ]
            },
            {path: 'journal-reviewers', component: EditorReviewersComponent, canActivate: [authGuardUserGuard], data: {roles: ['editor']}, title: 'Journal Reviewers - ScholarPress'},
            {path: 'journal-reports', component: EditorReportsComponent, canActivate: [authGuardUserGuard], data: {roles: ['editor']}, title: 'Journal Reports - ScholarPress'},
            {path: 'journal-editorial-board', component: EditorEditorialBoardComponent, canActivate: [authGuardUserGuard], data: {roles: ['editor']}, title: 'Journal Settings - ScholarPress'},
            
            // reviewer panel:
            {path: 'reviewer-dashboard', component: ReviewerDashboardComponent, canActivate: [authGuardUserGuard], data: {roles: ['reviewer']}, title: 'Reviewer Dashboard - ScholarPress'},
            {path: 'reviewer-manuscripts', component: ReviewerAssignedManuscriptsComponent, canActivate: [authGuardUserGuard], data: {roles: ['reviewer']}, title: 'Reviewer Assigned Manuscripts - ScholarPress'},
            {path: 'reviewer-reviews', component: ReviewerSubmittedReviewsComponent, canActivate: [authGuardUserGuard], data: {roles: ['reviewer']}, title: 'Reviewer Submitted Reviews - ScholarPress'},
            
            // admin panel:
            {path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuardUserGuard], data: {roles: ['admin']}, title: 'Admin Dashboard - ScholarPress'},
            {path: 'admin-journal-publication', component: AdminJournalPublicationComponent, canActivate: [authGuardUserGuard], data: {roles: ['admin']}, title: 'Journal Publication - ScholarPress'},
            {path: 'admin-user-submissions', component: AdminUserSubmissionsComponent, canActivate: [authGuardUserGuard], data: {roles: ['admin']}, title: 'User Submissions - ScholarPress'},
            {path: 'admin-journal-management', component: AdminJournalManagementComponent, canActivate: [authGuardUserGuard], data: {roles: ['admin']}, title: 'Journal Management - ScholarPress'},
            {path: 'admin-editorial-management', component: AdminEditorialManagementComponent, canActivate: [authGuardUserGuard], data: {roles: ['admin']}, title: 'Editorial Management - ScholarPress'},
            {path: 'admin-reviewer-management', component: AdminReviewerManagementComponent, canActivate: [authGuardUserGuard], data: {roles: ['admin']}, title: 'Reviewer Management - ScholarPress'},
            {path: 'admin-user-management', component: AdminUserManagementComponent, canActivate: [authGuardUserGuard], data: {roles: ['admin']}, title: 'User Management - ScholarPress'},
            {path: 'admin-site-settings', component: AdminSiteSettingsComponent, canActivate: [authGuardUserGuard], data: {roles: ['admin']}, title: 'Site Settings - ScholarPress'},
            {path: 'admin-activity-logs', component: AdminActivityLogsComponent, canActivate: [authGuardUserGuard], data: {roles: ['admin']}, title: 'Activity Logs - ScholarPress'},
        ]
    },
    // error page:
    {path: '**', component: ErrorpageViewComponent,
        children: [
            {path: '**', component: ErrorpageComponent, title: 'Page Not Found - ScholarPress'}
        ]
    }
];
