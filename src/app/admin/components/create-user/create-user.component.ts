import {Component, DestroyRef, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {CustomHttpService} from "../../../services/custom-http.service";
import {AlertifyService, MessageType, Position} from "../../../services/common/alertify.service";
import {Router} from "@angular/router";
import {CreateUser} from "../../../models/user/create-user.model";

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [MatButton, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  private customHttpService = inject(CustomHttpService);
  private alertifyService = inject(AlertifyService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  registerForm = new FormGroup({
    mailAddress: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    }),
    fullName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    })
  })

  onSubmit(){
    this.createUser();
  }

  createUser(){
    const subscription = this.customHttpService.post<CreateUser>("user-management.insert", {
      "email": this.registerForm.controls.mailAddress.value,
      "fullname": this.registerForm.controls.fullName.value
    }).subscribe({
      next: (response) => {
        this.alertifyService.message("kayıt başarılı", {messageType: MessageType.Success, position: Position.Top_Right});
        this.router.navigate(['/admin/users']);
      },
      error: (err) => console.log(err)
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
