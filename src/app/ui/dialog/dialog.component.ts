import {Component, inject, input, output, signal} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {CustomHttpService} from "../../services/custom-http.service";

@Component({
  selector: 'app-dialog',
  standalone: true,
    imports: [MatButton, FormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  sendInfo = output<{ showDialog: boolean, dueDate: string | null}>();

  onSubmitDialog(form: NgForm) {
    if (form.valid) {
      const rawDate = form.value.dueDate; // YYYY-MM-DD formatındaki tarih
      const formattedDate = this.formatDate(rawDate); // DD.MM.YYYY formatına dönüştür

      this.sendInfo.emit({
        showDialog:false,
        dueDate: formattedDate
      })
    }
  }

  private formatDate(rawDate: string): string {
    const dateParts = rawDate.split('-'); // YYYY-MM-DD
    return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`; // DD.MM.YYYY
  }

  onCloseDialog(){
    this.sendInfo.emit({
      showDialog: false,
      dueDate: null,
    });
  }
}
