import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { Todo } from '../../types/todo';
import { TodoComponent } from '../todo/todo.component';
import { ActiveItemsPipe } from '../../pipes/active-items.pipe';
import { HttpModule } from '../../modules/http/http.module';
import { TodoService } from '../../services/todo.service';
import { BehaviorSubject, switchMap } from 'rxjs';

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
    HttpModule,
    RouterModule
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  providers: [TodoService]
})
export class TodosComponent implements OnInit {
  editing = false;
  _todos: Todo[] = [];
  activeTodos: Todo[] = [];
  completedTodos: Todo[] = [];
  usedTodos$$ = new BehaviorSubject<Todo[]>(this.allTodos);

  status = 'all';

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
    this.completedTodos = [...value.filter(x => x.completed)];
  }

  get allTodos() {
    return this._todos;
  }

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.todoService.todos$
      .subscribe(todos => {
        this.todos = todos;
        this.usedTodos$$.next(this.getFormedTodos(todos));
      });

    this.route.params.subscribe(params => {
      this.status = params['status'];

      switch (this.status) {
        case 'active': {
          this.usedTodos$$.next(this.activeTodos);

          break;
        }

        case 'completed': {
          this.usedTodos$$.next(this.completedTodos);

          break;
        }

        default: {
          this.usedTodos$$.next(this.allTodos);
        }
      }
    })

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

  getFormedTodos(todos: Todo[]) {
    switch (this.status) {
      case 'active': {
        return todos.filter(x => !x.completed);
      }

      case 'completed': {
        return todos.filter(x => x.completed);
      }

      default: {
        return todos;
      }
    }
  }
}
