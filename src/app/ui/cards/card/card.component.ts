import {Component, input} from '@angular/core';
import {Book} from "../../../models/book/book.model";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  book = input.required<Book>();
}
