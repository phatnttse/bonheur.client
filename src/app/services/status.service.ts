import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor() {}

  // Status of loading spinner | true: show spinner, false: hide spinner
  public statusLoadingSpinnerSource = new BehaviorSubject<boolean>(false);
  statusLoadingSpinner$ = this.statusLoadingSpinnerSource.asObservable();
}
