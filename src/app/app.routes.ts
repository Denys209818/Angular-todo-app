import { Routes } from '@angular/router';
import { TodosComponent } from './components/todos/todos.component';
import { AboutPageComponent } from './components/about-page/about-page.component';

export const routes: Routes = [
  { path: 'todos', component: TodosComponent },
  { path: 'about', component: AboutPageComponent },
  { path: '**', redirectTo: '/todos', pathMatch: 'full' },
];
