import { JsonPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LetModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { MaterialCommonModule } from '@emat/shared/ui/material';
import { selectSelectedCoursePageViewModel } from '../store';

@Component({
  selector: 'emat-lesson-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngrxLet="vm$ as vm; error as e; complete as c">
      <h2>Antes de empezar...</h2>
      <pre>{{ vm.selectedCourse | json }}</pre>
      <p *ngIf="e">Error test: {{ e }}</p>
      <p *ngIf="c">Completed test</p>
    </ng-container>
  `,
  imports: [MaterialCommonModule, LetModule, JsonPipe, NgIf],
})
export class LessonPageComponent {
  protected readonly store = inject(Store);
  readonly vm$ = this.store.select(selectSelectedCoursePageViewModel);
}
