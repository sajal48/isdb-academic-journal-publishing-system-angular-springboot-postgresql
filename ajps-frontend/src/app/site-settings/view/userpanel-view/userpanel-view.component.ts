import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../components/footer/footer.component';
import { UserSidebarComponent } from '../../../user/components/user-sidebar/user-sidebar.component';
import { HeaderComponent } from "../../../components/header/header.component";

@Component({
  selector: 'app-userpanel-view',
  imports: [RouterOutlet, FooterComponent, UserSidebarComponent, HeaderComponent],
  templateUrl: './userpanel-view.component.html',
  styleUrl: './userpanel-view.component.css'
})
export class UserpanelViewComponent {

}
