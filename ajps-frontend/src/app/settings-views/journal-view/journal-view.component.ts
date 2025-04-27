import { Component } from '@angular/core';
import { JournalHeaderComponent } from "../../journals/journal-header/journal-header.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-journal-view',
  imports: [JournalHeaderComponent, RouterOutlet],
  templateUrl: './journal-view.component.html',
  styleUrl: './journal-view.component.css'
})
export class JournalViewComponent {

}
