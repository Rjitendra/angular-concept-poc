import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  Subscription,
  Observable,
  share,
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  map,
  of,
} from 'rxjs';

import { PEOPLE_DATA } from './data';
import { LookupService, Person } from '../../../../../../../libs/cl-common/cl-expression-builder/src/public-api';

@Injectable({
  providedIn: 'root',
})
export class SampleRemoteService implements OnDestroy, LookupService {
  error?: (err: Error) => void;
  private _data: BehaviorSubject<Person[]> = new BehaviorSubject<Person[]>([]);
  private _search: Subject<string> = new Subject();
  private _loading!: boolean;
  private searchSubs!: Subscription;

  constructor() {
    this.setup();
  }
  get data(): Observable<Person[]> {
    return this._data.pipe(share());
  }

  get loading(): boolean {
    return this._loading;
  }

  setup() {
    this.searchSubs = this._search
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this._loading = true)),
        switchMap((value) => this.retrieveRemote(value)),
      )
      .subscribe(
        (data) => {
          console.log(data);
          this._data.next(data);
          this._loading = false;
        },
        (err) => {
          this._loading = false;
          this.emitError(err as Error);
        },
      );
  }

  ngOnDestroy() {
    if (this.searchSubs) this.searchSubs.unsubscribe();
    this._data.complete();
    this._search.complete();
  }

  search(nameContains: string): void {
    this._search.next(nameContains);
  }

  private retrieveRemote(nameContains: string): Observable<Person[]> {
    // here we need to call api
    return of(PEOPLE_DATA).pipe(
      map((people: Person[]) => {
        if (nameContains) {
          return people.filter((person) =>
            person.FirstName.includes(nameContains),
          );
        }
        console.log(people);
        return people;
      }),
    );
  }

  private emitError(err: Error): void {
    if (this.error) {
      this.error(err);
    }
  }
}
