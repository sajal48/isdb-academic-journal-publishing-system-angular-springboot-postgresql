import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ErrorpageComponent } from '../../../errorpage/errorpage.component';
import { NgxLoadingBar } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-errorpage-view',
  imports: [HeaderComponent, FooterComponent, ErrorpageComponent, NgxLoadingBar],
  templateUrl: './errorpage-view.component.html',
  styleUrl: './errorpage-view.component.css'
})
export class ErrorpageViewComponent {

}
