import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EnvironmentProviders, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Todo } from './types/todo';
import { TodoComponent } from "./components/todo/todo.component";
import { ActiveItemsPipe } from "./pipes/active-items.pipe";
import { TodoService } from './services/todo.service';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { HttpModule } from './modules/http/http.module';

const todos = [
  {id: 1, title: 'HTML + CSS', completed: true },
  {id: 2, title: 'JS', completed: false },
  {id: 3, title: 'React', completed: false },
  {id: 4, title: 'Angular', completed: false },
];

@Component({
  selector: 'app-root',
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
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [TodoService]
})
export class AppComponent implements OnInit {
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
    this.todoService.getTodos()
      .subscribe(todos => {
        this.todos = todos;
      })
  }

  handleFormSubmit() {
    if (!this.todoForm.valid) {
      return;
    }

    this.addTodo(this.title.value);
    this.todoForm.reset();
  }

  addTodo(newTitle: string) {
    this.todos = [...this.allTodos, {
      id: Date.now(),
      title: newTitle,
      completed: false,
    }]
  }

  renameTodo(id: number, newTitle: string) {
    this.todos = [...this.allTodos.map(el => {
      if (el.id !== id) {
        return el;
      }

      return {
        ...el,
        title: newTitle,
      }
    })];
  }

  deleteTodo(id: number) {
    this.todos = [...this.allTodos.filter(x => x.id !== id)];
  }

  toggleTodo(id: number) {
    this.todos = [...this.allTodos.map(el => {
      if (el.id !== id) {
        return el;
      }

      return { ...el, completed: !el.completed };
    })];
  }

  getTrackById(i: number, todo: Todo) {
    return todo.id;
  }
}
function importProvidersFrom(arg0: EnvironmentProviders): import("@angular/core").Provider {
  throw new Error('Function not implemented.');
}

function withInterceptorsFromDi(): import("@angular/common/http").HttpFeature<import("@angular/common/http").HttpFeatureKind> {
  throw new Error('Function not implemented.');
}

