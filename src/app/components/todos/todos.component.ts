import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Todo } from '../../types/todo';
import { TodoComponent } from '../todo/todo.component';
import { ActiveItemsPipe } from '../../pipes/active-items.pipe';
import { HttpModule } from '../../modules/http/http.module';
import { TodoService } from '../../services/todo.service';


@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TodoComponent,
    ActiveItemsPipe,
    HttpModule
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  providers: [TodoService]
})
export class TodosComponent implements OnInit {
  editing = false;
  _todos: Todo[] = [];
  activeTodos: Todo[] = [];
  todoForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(3)
      ]
    })
  });

  get title() {
    return this.todoForm.get('title') as FormControl;
  }

  set todos(value: Todo[]) {
    if (value === this._todos) {
      return;
    }

    this._todos = value;
    this.activeTodos = [...value.filter(x => !x.completed)];
  }

  get allTodos() {
    return this._todos;
  }

  constructor(
    private todoService: TodoService
  ) {}

  ngOnInit(): void {
    this.todoService.todos$
      .subscribe(todos => {
        this.todos = todos;
      });

    this.todoService.loadTodos();
  }

  handleFormSubmit() {
    if (!this.todoForm.valid) {
      return;
    }

    this.addTodo(this.title.value);
    this.todoForm.reset();
  }

  addTodo(newTitle: string) {
    const newTodo = {
      id: Date.now(),
      title: newTitle,
      completed: false,
    };

    this.todoService.addTodo(newTodo)
      .subscribe();
  }

  renameTodo(id: number, newTitle: string) {
    const current = this.allTodos.filter(x => x.id === id)[0];

    this.todoService.updateTodo({
      ...current,
      title: newTitle
    }).subscribe();
  }

  deleteTodo(id: number) {
    const current = this.allTodos.filter(x => x.id === id)[0];

    this.todoService.deleteTodo(current).subscribe();
  }

  toggleTodo(id: number) {
    const current = this.allTodos.filter(x => x.id === id)[0];

    this.todoService.updateTodo({
      ...current,
      completed: !current.completed
    }).subscribe();
  }

  getTrackById(i: number, todo: Todo) {
    return todo.id;
  }
}
