import {Component, input, OnInit, output, signal} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {ApiResponse} from "../../../models/api-response.model";

@Component({
  selector: 'app-update-book-dialog',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './update-book-dialog.component.html',
  styleUrl: './update-book-dialog.component.css'
})
export class UpdateBookDialogComponent implements OnInit {
  bookId = input.required<string>();
  showUpdateBookDialog = output<boolean>();
  book = signal<any>(null);

  ngOnInit() {
    console.log(this.bookId());
  }

  onCloseDialog(){
    this.showUpdateBookDialog.emit(false);
  }

  // dialog açıldığında name ve author bilgisini inputlara taşı update-book-dialoghtml sayfasında (input tasarımı yapılmadı)
}
