import {Component, DestroyRef, inject, input, OnInit, signal} from '@angular/core';
import {CustomHttpService} from "../../services/custom-http.service";
import {Book} from "../../models/book/book.model";
import {RouterLink} from "@angular/router";
import {TitleCasePipe} from "@angular/common";
import {AlertifyService, MessageType, Position} from "../../services/common/alertify.service";
import {DialogComponent} from "../dialog/dialog.component";


@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    RouterLink,
    TitleCasePipe,
    DialogComponent
  ],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent implements OnInit{
  private customHttpService = inject(CustomHttpService);
  private alertifyService = inject(AlertifyService)
  private destroyRef = inject(DestroyRef);

  bookId = input.required<string>(); // route'dan gelen bookId bilgisi
  book = signal<Book | undefined>(undefined);
  showDialog = signal<boolean>(false)

  ngOnInit() {
    this.getBookById();
  }

  getBookById() {
    const subscription = this.customHttpService.post<Book>("library-management.getById", {
      bookId: this.bookId()
    }).subscribe({
      next: (response) => {
        this.book.set(response.data)
      },
      error: (err) => console.log(err)
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onRentBook(){
    this.showDialog.set(true)
  }

  // burda hata var, eğer dialog iptal edilip çıkılarsa sendInfo eventınden buraya dueDate null geliyor sonra api ye çağrı yapınca bum
  onSendInfo(data: {showDialog: boolean, dueDate: string | null}){
    this.showDialog.set(data.showDialog);

    const requestData = {
      userId: "66f457f5b43db0dca20bc688", // bu değişecek ileride giriş yapan user işlemlerini yaptıkdan sonra
      bookId: this.bookId(),
      dueDate: data.dueDate,
    }
    this.customHttpService.post<null>("library-management.rentBook", requestData).subscribe({
      next: (response) => {
        this.alertifyService.dismiss();
        this.alertifyService.message("kiralama işlemi başarılı", {messageType: MessageType.Success, position: Position.Top_Right, delay:2});
      },
      error: err => {
        this.alertifyService.dismiss();
        this.alertifyService.message("Beklenmedik bir hata meydana geldi. Lütfen daha sonra tekrar deneyiniz", {messageType: MessageType.Error});
      }
    })
  }


}
