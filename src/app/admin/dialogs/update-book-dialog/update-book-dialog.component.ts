import {Component, DestroyRef, inject, input, OnInit, output} from '@angular/core';

import {MatButton} from "@angular/material/button";
import {Book} from "../../../models/book/book.model";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomHttpService} from "../../../services/custom-http.service";
import {AlertifyService, MessageType, Position} from "../../../services/common/alertify.service";
import {ApiResponse} from "../../../models/api-response.model";


@Component({
  selector: 'app-update-book-dialog',
  standalone: true,
  imports: [MatButton, ReactiveFormsModule],
  templateUrl: './update-book-dialog.component.html',
  styleUrl: './update-book-dialog.component.css'
})
export class UpdateBookDialogComponent implements OnInit {
  private customHttpService = inject(CustomHttpService);
  private alertifyService = inject(AlertifyService);
  private destroyRef = inject(DestroyRef);

  showUpdateBookDialog = output<boolean>();
  book = input.required<Book>();
  updateBookDialogForm: FormGroup;
  // formdan gelen yeni book bilgilerini parent component'deki tabloda güncellemek için tanımladım
  updatedBookInfos = output<Book>();

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.updateBookDialogForm = new FormGroup({
      bookId: new FormControl(this.book().bookId, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(150)]
      }),
      bookName: new FormControl(this.book()?.name, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(150)],
      }),
      author: new FormControl(this.book()?.author, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(150)],
      }),
    });
  }

  onCloseDialog() {
    this.showUpdateBookDialog.emit(false);
  }

  onSubmitDialog() {
    this.updateBookHttpRequest().then(() => {
      this.publishNewBookInfos();
      this.showUpdateBookDialog.emit(false);
    });
  }
  updateBookHttpRequest(): Promise<void> {
    return new Promise((resolve, reject) => {
      const subscription = this.customHttpService.post<ApiResponse<null>>("library-management.update", {
        id: this.updateBookDialogForm.controls["bookId"].value,
        name: this.updateBookDialogForm.get("bookName").value,
        author: this.updateBookDialogForm.controls["author"].value,
      }).subscribe({
        next: (response) => {
          this.alertifyService.message("Kitap başarıyla güncellenmiştir", {
            messageType: MessageType.Message,
            position: Position.Top_Center,
            delay: 3
          });
          resolve();
        },
        error: err => {
          this.alertifyService.message(err.message, { messageType: MessageType.Error });
          reject(err);
        },
      });

      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    });
  }

  publishNewBookInfos() {
    const updateBookInfos: Book = {
      bookId: this.updateBookDialogForm.controls["bookId"].value,
      name: this.updateBookDialogForm.get("bookName").value,
      author: this.updateBookDialogForm.controls["author"].value
    };

    this.updatedBookInfos.emit(updateBookInfos);
  }

  // onSubmitDialog() {
  //   this.updateBookHttpRequest();
  //   this.publishNewBookInfos();
  //   this.showUpdateBookDialog.emit(false);
  // }
  //
  // updateBookHttpRequest() {
  //   const subscription = this.customHttpService.post<ApiResponse<null>>("library-management.update", {
  //     id: this.updateBookDialogForm.controls["bookId"].value,
  //     name: this.updateBookDialogForm.get("bookName").value,
  //     author: this.updateBookDialogForm.controls["author"].value,
  //   }).subscribe({
  //     next: (response) => {
  //       this.alertifyService.message("Kitap başarıyla güncellenmiştir", {
  //         messageType: MessageType.Success,
  //         position: Position.Top_Center,
  //         delay: 3
  //       });
  //     },
  //     error: err => this.alertifyService.message(err.message, {messageType: MessageType.Error}),
  //   });
  //
  //   this.destroyRef.onDestroy(() => subscription.unsubscribe());
  // }
}
