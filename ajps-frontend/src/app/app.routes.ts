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
        ]        
    },
    {path: '**', component: ErrorpageComponent, title: 'Page Not Found - ScholarPress'}
];
