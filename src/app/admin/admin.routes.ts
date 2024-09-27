import {Routes} from "@angular/router";
import {ListUsersComponent} from "./components/list-users/list-users.component";
import {ListBooksComponent} from "./components/list-books/list-books.component";
import {BookDetailComponent} from "./components/book-detail/book-detail.component";
import {CreateBookDialogComponent} from "./dialogs/create-book-dialog/create-book-dialog.component";
import {CreateUserComponent} from "./components/create-user/create-user.component";

export const adminRoutes: Routes = [
  {
    path: 'users',
    component: ListUsersComponent,
    pathMatch: "prefix"
  },
  {
    path: 'users/create-user',
    component: CreateUserComponent
  },
  {
    path: 'books',
    component: ListBooksComponent
  },
  {
    path: 'books/book-detail/:bookId',
    component: BookDetailComponent
  },
  {
    path: 'books/create-book',
    component: CreateBookDialogComponent
  }
]
