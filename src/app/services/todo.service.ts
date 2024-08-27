import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../types/todo';

const URL = 'https://mate.academy/students-api/todos?userId=6548';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(
    private client: HttpClient
  ) {}

  getTodos() {
    return this.client.get<Todo[]>(URL);
  }
}
