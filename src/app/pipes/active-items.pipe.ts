import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from '../types/todo';

@Pipe({
  name: 'activeItems',
  standalone: true,
  pure: true,
})
export class ActiveItemsPipe implements PipeTransform {

  transform(value: Todo[]): Todo[] {
    return [...value.filter(x => !x.completed)];
  }

}
