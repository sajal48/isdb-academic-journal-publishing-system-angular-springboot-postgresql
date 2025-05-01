import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-publisher-view',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './publisher-view.component.html',
  styleUrl: './publisher-view.component.css'
})
export class PublisherViewComponent {

}
