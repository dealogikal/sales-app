import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  USER_STORAGE = 'DEMO_USER';

  user$: BehaviorSubject<any> = new BehaviorSubject(undefined);

  constructor() {
    this.retrieve();
  }

  retrieve(): void {
    const user = JSON.parse(sessionStorage.getItem(this.USER_STORAGE) as string);
    this.user$.next(user);
  }

  set(user: any): void {
    this.user$.next(user);
    sessionStorage.setItem(this.USER_STORAGE, JSON.stringify(user));
  }


  get(): Observable<any> {
    return this.user$.asObservable();
  }

  logout(): void {
    sessionStorage.removeItem(this.USER_STORAGE);
    this.user$.next(undefined);
  }

}
