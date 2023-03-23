import { Component, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { ViewCoursePageActions } from '../store';
import { selectedCoursePageComponent } from './selected-course-page.component';

//Note: Container components can be reused as well. Implementation details
//determine if a component is a presentation or container component.
//ViewPage maps router params to a 'Select' course action, while
//displaying the selected course is handled by SelectedPageComponent.

@Component({
  standalone: true,
  selector: 'emat-view-course-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <emat-selected-course-page /> `,
  imports: [selectedCoursePageComponent],
})
export class ViewCoursePageComponent implements OnDestroy {
  protected readonly store = inject(Store);
  protected readonly route = inject(ActivatedRoute);

  actionsSubscription = this.route.params
    .pipe(map((params) => ViewCoursePageActions.selectedCourse({ id: Number(params['courseId']) })))
    .subscribe((action) => this.store.dispatch(action));

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}
