import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ErrorpageComponent } from '../../../errorpage/errorpage.component';

@Component({
  selector: 'app-errorpage-view',
  imports: [HeaderComponent, FooterComponent, ErrorpageComponent],
  templateUrl: './errorpage-view.component.html',
  styleUrl: './errorpage-view.component.css'
})
export class ErrorpageViewComponent {

}
