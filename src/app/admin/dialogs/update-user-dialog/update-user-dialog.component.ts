import {Component, DestroyRef, inject, input, OnInit, output} from '@angular/core';
import {User} from "../../../models/user/user.model";
import {MatButton} from "@angular/material/button";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomHttpService} from "../../../services/custom-http.service";
import {AlertifyService, MessageType} from "../../../services/common/alertify.service";
import {UpdateUser} from "../../../models/user/update-user.model";

@Component({
  selector: 'app-update-user-dialog',
  standalone: true,
  imports: [MatButton, ReactiveFormsModule],
  templateUrl: './update-user-dialog.component.html',
  styleUrl: './update-user-dialog.component.css'
})
export class UpdateUserDialogComponent implements OnInit{
  private customHttpService = inject(CustomHttpService);
  private alertifyService = inject(AlertifyService);
  private destroyRef = inject(DestroyRef);

  selectedUser = input.required<User>();
  showDialog = output<boolean>();
  updateUserDialogForm : FormGroup;
  updatedSelectedUser = output<User>();

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(){
    this.updateUserDialogForm = new FormGroup({
      userId : new FormControl(this.selectedUser().userId, {
        validators: [Validators.required]
      }),
      fullName: new FormControl(this.selectedUser().fullname, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      }),
      email: new FormControl(this.selectedUser().email, {
        validators: [Validators.required, Validators.email]
      }),
      isActive: new FormControl(this.selectedUser().isActive, {
        validators: [Validators.required]
      }),
    });
  }

  onSubmit(){
    this.sendUpdateUserHttpRequest();
    this.updatedSelectedUser.emit({
      userId: this.selectedUser().userId,
      fullname: this.updateUserDialogForm.controls["fullName"].value,
      email: this.updateUserDialogForm.get("email").value,
      isActive: this.updateUserDialogForm.controls["isActive"].value,
    })
    this.showDialog.emit(false);
  }

  sendUpdateUserHttpRequest() {
    const requestData = {
      userId: this.selectedUser().userId,
      fullname: this.updateUserDialogForm.controls["fullName"].value,
      email: this.updateUserDialogForm.get("email").value,
      isActive: this.updateUserDialogForm.controls["isActive"].value,
    };

    this.customHttpService.post<UpdateUser>("user-management.update", requestData).subscribe({
      next: (response) => {
        this.alertifyService.message("Kullanıcı başarıyla güncellendi",{messageType: MessageType.Success});
      },
      error: (error) => {
        this.alertifyService.message("Kullanıcı güncellenirken bir hata oluştu.",{messageType: MessageType.Error});
      }
    });
  }

  onCloseDialog(){
    this.showDialog.emit(false);
  }
}
