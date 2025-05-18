import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NgxLoadingBar } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-publisher-view',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgxLoadingBar],
  templateUrl: './publisher-view.component.html',
  styleUrl: './publisher-view.component.css'
})
export class PublisherViewComponent {

}
