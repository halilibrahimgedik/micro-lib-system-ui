import {Routes} from "@angular/router";
import {ListUsersComponent} from "./components/list-users/list-users.component";
import {ListBooksComponent} from "./components/list-books/list-books.component";
import {BookDetailComponent} from "./components/book-detail/book-detail.component";

export const adminRoutes: Routes = [
  {
    path: 'users',
    component: ListUsersComponent,
    pathMatch: "prefix"
  },
  {
    path: 'books',
    component: ListBooksComponent
  },
  {
    path: 'books/book-detail/:bookId',
    component: BookDetailComponent
  }
]
