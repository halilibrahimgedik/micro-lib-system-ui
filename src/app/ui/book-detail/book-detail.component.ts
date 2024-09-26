import {Component, DestroyRef, inject, input, OnInit, signal} from '@angular/core';
import {CustomHttpService} from "../../services/custom-http.service";
import {Book} from "../../models/book/book.model";
import {ApiResponse} from "../../models/api-response.model";


@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent implements OnInit{
  private customHttpService = inject(CustomHttpService);
  private destroyRef = inject(DestroyRef);

  bookId = input.required<string>(); // route'dan gelen bookId bilgisi
  book = signal<Book | undefined>(undefined);

  ngOnInit() {
    this.getBookById();
  }

  getBookById() {
    const subscription = this.customHttpService.post<Book>("library-management.getById", {
      bookId: this.bookId()
    }).subscribe({
      next: (response: ApiResponse<Book>) => this.book.set(response.data),
      error: (err) => console.log(err)
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
