import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Todo } from '../../types/todo';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent implements OnChanges {
  @Input() todo!:Todo;

  @Output() delete = new EventEmitter();
  @Output() rename = new EventEmitter<string>();
  @Output() toggle = new EventEmitter();

  @ViewChild('inputField')
  set inputField(value: ElementRef) {
    if (value) {
      value.nativeElement.focus();
    }
  }

  editing = false;
  title = '';

  constructor() {}

  ngOnChanges({ todo }: SimpleChanges): void {
    if (todo.currentValue.title !== todo.previousValue?.title) {
      this.title = todo.currentValue.title;
    }
  }

  edit() {
    this.editing = true;
    this.title = this.todo.title;
  }

  save() {
    if (!this.editing) {
      return;
    }

    this.editing = false;
    this.rename.emit(this.title);
  }
}
