import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchResultsService {
  private searchResultsSource = new BehaviorSubject<any[]>([]);
  currentSearchResults = this.searchResultsSource.asObservable();

  constructor() {}

  updateSearchResults(results: any[]) {
    this.searchResultsSource.next(results);
  }
}
