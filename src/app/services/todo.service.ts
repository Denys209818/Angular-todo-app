import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../types/todo';
import { BehaviorSubject, Observable, switchMap, tap, withLatestFrom } from 'rxjs';

const URL = 'https://mate.academy/students-api';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todos$$ = new BehaviorSubject<Todo[]>([]);

  todos$ = this.todos$$.asObservable();

  constructor(
    private client: HttpClient
  ) {

  }

  loadTodos() {
    this.client.get<Todo[]>(URL + '/todos?userId=751')
      .subscribe(values => {
        this.todos$$.next(values);
      });
  }

  addTodo(todo: Todo) {
    return this.client.post<Todo>(URL + '/todos', {...todo, userId: 751, id: 0})
      .pipe(
        withLatestFrom(this.todos$$),
        tap(([createdTodo, todos]) => {
          this.todos$$.next([...todos, createdTodo]);
        })
      );
  }

  updateTodo(todo: Todo) {
    return this.client.patch<Todo>(URL + `/todos/${todo.id}`, todo)
      .pipe(
        withLatestFrom(this.todos$$),
        tap(([updatedTodo, todos]) => {
          const ind = todos.findIndex(x => x.id === updatedTodo.id)

          this.todos$$.next([...todos.slice(0, ind), updatedTodo, ...todos.slice(ind + 1)]);
        })
      );;
  }

  deleteTodo(todo: Todo) {
    return this.client.delete(URL + `/todos/${todo.id}`)
      .pipe(
        withLatestFrom(this.todos$$),
        tap(([_, todos]) => {
          this.todos$$.next([...todos.filter(x => x.id !== todo.id)]);
        })
      );;
  }
}
