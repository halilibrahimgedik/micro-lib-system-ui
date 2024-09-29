import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {CustomHttpService} from "../../../services/custom-http.service";
import {AlertifyService, MessageType} from "../../../services/common/alertify.service";
import {BookWithUsers} from "../../../models/book/book-with-users.model";
import {HttpErrorResponse} from "@angular/common/http";
import {RouterLink} from "@angular/router";
import {UpdateBookDialogComponent} from "../../dialogs/update-book-dialog/update-book-dialog.component";
import {Book} from "../../../models/book/book.model";
import {TruncatePipe} from "../../../pipes/truncate.pipe";

@Component({
  selector: 'app-list-books',
  standalone: true,
  imports: [RouterLink, UpdateBookDialogComponent, TruncatePipe],
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.css', '../../admin.component.css']
})
export class ListBooksComponent implements OnInit{
  private customHttpService = inject(CustomHttpService);
  private alertifyService = inject(AlertifyService);
  private destroyRef = inject(DestroyRef);

  booksWithUsers = signal<BookWithUsers[] | undefined>(undefined);
  showUpdateBookDialog = signal(false)
  updatedBook = signal<Book | null>(null);

  ngOnInit() {
    this.getBookList();
  }

  getBookList(){
    const subscription = this.customHttpService.post<BookWithUsers[]>("library-management.getBooksWithUsers").subscribe({
      next: (response) => {
        this.booksWithUsers.set(response.data["books"]);
      },
      error: (error: HttpErrorResponse) => {
        this.alertifyService.dismiss();
        this.alertifyService.message(error.message, {
          messageType: MessageType.Error
        })
      }
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onUpdateBook(bookId: string){
    const bookInfos = this.booksWithUsers()?.find(book => book.bookId === bookId);
    if (bookInfos) {
      const { users, ...bookWithoutUsers } = bookInfos;
      this.updatedBook.set(bookWithoutUsers);
    }

    this.showUpdateBookDialog.set(true);
  }

  onClose(closeDialog: boolean){
    this.showUpdateBookDialog.set(closeDialog);
  }

  onUpdateBookInfos(newBookInfos: Book){
    this.updatedBook.set(newBookInfos);
    const oldBookInfos = this.booksWithUsers().find(book => book.bookId === newBookInfos.bookId);
    if (oldBookInfos) {
      const updatedInfo = {...oldBookInfos, // Eski bilgileri kopyala
        name: newBookInfos.name, // Yeni adı ata
        author: newBookInfos.author // Yeni yazarı ata
        // users ve bookId alanlarını değiştirmeyeceğiz
      };

      // booksWithUsers dizisini güncelleyelim
      const updatedBooksWithUsers = this.booksWithUsers()
        .map(book => book.bookId === newBookInfos.bookId ? updatedInfo : book);

      this.booksWithUsers.set(updatedBooksWithUsers)
    }
  }

  onRemoveBook(bookId: string){
    const requestData = {
      id: bookId,
    }
    this.customHttpService.post<null>("library-management.delete", requestData).subscribe({
      next: (response) => {
        this.booksWithUsers.set(this.booksWithUsers().filter(book => book.bookId !== bookId));
        this.alertifyService.dismiss();
        this.alertifyService.message("Kitap başarılı bir şekilde silinmiştir.", {messageType: MessageType.Success});
      },
      error: err => {this.alertifyService.message("kitap silinemedi. lütfen daha sonra tekrar deneyiniz.", {messageType: MessageType.Error});}
    })
  }

}
