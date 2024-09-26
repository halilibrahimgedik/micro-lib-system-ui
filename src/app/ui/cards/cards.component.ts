import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {CardComponent} from "./card/card.component";

import {BookList} from "../../models/book/book-list.model";
import {CustomHttpService} from "../../services/custom-http.service";
import {ApiResponse} from "../../models/api-response.model";
import {AlertifyService, MessageType} from "../../services/common/alertify.service";

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent implements OnInit{
  private customHttpService = inject(CustomHttpService);
  private alertifyService = inject(AlertifyService);
  private destroyRef = inject(DestroyRef);

  books = signal<BookList | undefined>(undefined)

  ngOnInit() {
    this.getBooks();
  }

  getBooks(){
    const subscription = this.customHttpService.post<BookList>("library-management.getList").subscribe({
      next: (response: ApiResponse<BookList>) => {
        this.books.set(response.data);
      },
      error: (err) => {
        this.alertifyService.message("bir hata meydana geldi\n" + err, {
          messageType: MessageType.Error,
        })
      }
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

}
