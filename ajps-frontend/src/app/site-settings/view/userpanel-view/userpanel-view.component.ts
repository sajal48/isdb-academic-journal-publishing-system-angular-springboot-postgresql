import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserSidebarComponent } from '../../../user/components/user-sidebar/user-sidebar.component';
import { HeaderComponent } from "../../../components/header/header.component";
import { FooterComponent } from "../../../components/footer/footer.component";

@Component({
  selector: 'app-userpanel-view',
  imports: [RouterOutlet, UserSidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './userpanel-view.component.html',
  styleUrl: './userpanel-view.component.css'
})
export class UserpanelViewComponent {

}
