import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {CustomHttpService} from "../../../services/custom-http.service";
import {AlertifyService, MessageType, Position} from "../../../services/common/alertify.service";
import {HttpErrorResponse} from "@angular/common/http";
import {User} from "../../../models/user/user.model";
import {CommonModule, TitleCasePipe, UpperCasePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {UpdateUserDialogComponent} from "../../dialogs/update-user-dialog/update-user-dialog.component";

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [UpperCasePipe, TitleCasePipe, CommonModule, RouterLink, UpdateUserDialogComponent,],
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css', '../../admin.component.css']
})
export class ListUsersComponent implements OnInit{
  private customHttpService = inject(CustomHttpService);
  private alertifyService = inject(AlertifyService)
  private destroyRef = inject(DestroyRef);

  users = signal<User[] | undefined>(undefined);
  showUpdateUserDialog = signal(false);
  selectedUser = signal<User | undefined>(undefined);

  ngOnInit() {
    this.getUserList();
  }

  getUserList(){
    const subscription = this.customHttpService.post<User[]>("user-management.getList").subscribe({
      next: (response) => {
        this.users.set(response.data);
      },
      error: (error: HttpErrorResponse) => {
        this.alertifyService.dismiss();
        this.alertifyService.message(error.message, {messageType: MessageType.Error, delay: 3})
      }
    })

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  removeUser(userId: string){
    const subscription = this.customHttpService.post<any>("user-management.delete", {
      "userId": userId,
    }).subscribe({
      next: (response) => {
        this.alertifyService.dismiss();
        this.alertifyService.message("kulanıcının durumu başarılı bir şekilde güncellenmiştir.", {
          delay: 2,
          messageType: MessageType.Warning,
          position: Position.Top_Center
        })

        this.getUserList();
      },
      error: (error: HttpErrorResponse) => {
        this.alertifyService.dismiss();
        this.alertifyService.message(error.message + "statusCode: " + error.status, {messageType: MessageType.Error})
      }
    })

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onDeleteUser(userId: string){
    this.removeUser(userId);
  }

  onUpdateUser(userId: string){
    this.showUpdateUserDialog.set(true);
    this.selectedUser.set(this.users().find(user => user.userId === userId));
  }
  onCloseUpdateUserDialog(){
    this.showUpdateUserDialog.set(false);
  }

  onUpdatedSelectedUser(updatedSelectedUser: User){
    const oldUserInfos = this.users().find(user => user.userId === updatedSelectedUser.userId);
    oldUserInfos.fullname = updatedSelectedUser.fullname;
    oldUserInfos.email = updatedSelectedUser.email;
    oldUserInfos.isActive = updatedSelectedUser.isActive;
  }

}
