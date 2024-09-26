import { Routes } from '@angular/router';
import {BookDetailComponent} from "./ui/book-detail/book-detail.component";
import {RegisterComponent} from "./ui/register/register.component";
import {AdminComponent} from "./admin/admin.component";



export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import("./ui/cards/cards.component").then(module => module.CardsComponent),
  },
  {
    path: 'register',
    loadComponent: () => import("./ui/register/register.component").then(module => module.RegisterComponent),
  },
  {
    path: 'book/detail/:bookId',
    loadComponent: () => import("./ui/book-detail/book-detail.component").then(module => module.BookDetailComponent),
  },
  {
    path: 'admin',
    component: AdminComponent,
    loadChildren: () => import("./admin/admin.routes").then(module => module.adminRoutes),
  }
];
