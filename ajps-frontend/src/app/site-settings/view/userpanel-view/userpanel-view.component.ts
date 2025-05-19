import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserSidebarComponent } from '../../../user/components/user-sidebar/user-sidebar.component';
import { UserHeaderComponent } from "../../../user/components/user-header/user-header.component";
import { UserFooterComponent } from "../../../user/components/user-footer/user-footer.component";

@Component({
  selector: 'app-userpanel-view',
  imports: [RouterOutlet, UserSidebarComponent, UserHeaderComponent, UserFooterComponent],
  templateUrl: './userpanel-view.component.html',
  styleUrl: './userpanel-view.component.css'
})
export class UserpanelViewComponent {

}
