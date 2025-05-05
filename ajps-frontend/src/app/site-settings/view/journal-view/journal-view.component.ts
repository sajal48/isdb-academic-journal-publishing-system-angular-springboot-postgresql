import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { JournalBannerComponent } from '../../../journals/components/journal-banner/journal-banner.component';
import { JournalSidebarComponent } from '../../../journals/components/journal-sidebar/journal-sidebar.component';

@Component({
  selector: 'app-journal-view',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, JournalBannerComponent, JournalSidebarComponent],
  templateUrl: './journal-view.component.html',
  styleUrl: './journal-view.component.css'
})
export class JournalViewComponent {

}
