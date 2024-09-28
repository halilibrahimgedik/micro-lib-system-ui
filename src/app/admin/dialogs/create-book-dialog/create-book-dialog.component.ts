import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CustomHttpService} from "../../../services/custom-http.service";
import {AlertifyService, MessageType, Position} from "../../../services/common/alertify.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {CreateBookResponse} from "../../../models/book/create-book.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-book-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatButton],
  templateUrl: './create-book-dialog.component.html',
  styleUrl: './create-book-dialog.component.css'
})
export class CreateBookDialogComponent implements OnInit{
  private customHttpService = inject(CustomHttpService);
  private alertifyService = inject(AlertifyService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  createBookDialogForm: FormGroup;

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(){
    this.createBookDialogForm = new FormGroup({
      bookName: new FormControl('',{
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(150)]
      }),
      author: new FormControl('',{
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(150)],
      })
    })
  }

  onSubmitDialog(){
    this.createBookHttpRequest();
    this.onCloseDialog();
  }

  createBookHttpRequest(){
    const subscription = this.customHttpService.post<CreateBookResponse>("library-management.insert",{
      name: this.createBookDialogForm.controls["bookName"].value,
      author: this.createBookDialogForm.controls["author"].value,
    }).subscribe({
      next: (response) => {
        this.alertifyService.message("kitap başarıyla eklendi.",{
          messageType: MessageType.Success,
          position: Position.Top_Center,
        });
      },
      error: err => this.alertifyService.message("something went wrong", {messageType: MessageType.Error, position: Position.Top_Center}),
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onCloseDialog(){
    this.router.navigate(['/admin/books']);
  }
}
