import {Component, DestroyRef, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomHttpService} from "../../services/custom-http.service";
import {Router} from "@angular/router";
import {AlertifyService, MessageType} from "../../services/common/alertify.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
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
    this.registerUser();
  }

  registerUser(){
    const subscription = this.customHttpService.post<{data: string, errors:string}>("user-management.insert", {
      "email": this.registerForm.controls.mailAddress.value,
      "fullname": this.registerForm.controls.fullName.value
    }).subscribe({
      next: (response) => {
        this.alertifyService.message("kayıt başarılı", {messageType: MessageType.Success});
        this.router.navigate(['']);
      },
      error: (err) => console.log(err)
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
