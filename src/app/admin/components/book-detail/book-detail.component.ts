import {Component, DestroyRef, inject, input, OnInit, signal} from '@angular/core';
import {CustomHttpService} from "../../../services/custom-http.service";
import {AlertifyService, MessageType} from "../../../services/common/alertify.service";
import {BookWithUsers} from "../../../models/book/book-with-users.model";
import {RouterLink} from "@angular/router";
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    RouterLink,
    TitleCasePipe
  ],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent implements OnInit {
  private customHttpService = inject(CustomHttpService);
  private alertifyService = inject(AlertifyService);
  private destroyRef = inject(DestroyRef);

  bookId = input.required<string>();
  bookWithUsers = signal<BookWithUsers | null>(null);

  ngOnInit() {
    this.getBookWithUsers()
  }

  private getBookWithUsers() {
    const subscription = this.customHttpService.post<BookWithUsers>("library-management.getById", {
      bookId: this.bookId(),
    })
      .subscribe({
        next: (response) => {
          this.bookWithUsers.set(response.data);
        },
        error: (err) => {
          this.alertifyService.dismiss();
          this.alertifyService.message(err.message, {
            messageType: MessageType.Error,
          })
        }
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
