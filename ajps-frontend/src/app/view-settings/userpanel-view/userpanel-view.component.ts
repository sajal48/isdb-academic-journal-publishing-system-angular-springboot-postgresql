import { Component } from '@angular/core';
import { UserHeaderComponent } from "../../user/components/user-header/user-header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { UserSidebarComponent } from "../../user/components/user-sidebar/user-sidebar.component";

@Component({
  selector: 'app-userpanel-view',
  imports: [RouterOutlet, UserHeaderComponent, FooterComponent, UserSidebarComponent],
  templateUrl: './userpanel-view.component.html',
  styleUrl: './userpanel-view.component.css'
})
export class UserpanelViewComponent {

}
