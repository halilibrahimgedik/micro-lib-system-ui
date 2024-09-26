import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CardsComponent} from "./ui/cards/cards.component";
import {HeaderComponent} from "./header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CardsComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'micro-lib-system-ui';
}
