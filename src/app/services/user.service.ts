import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  CREDENTIAL_STORAGE = 'DEMO_CREDENTIAL';

  credential$: BehaviorSubject<any> = new BehaviorSubject(undefined);
  user$: BehaviorSubject<any> = new BehaviorSubject(undefined);

  constructor() {

  }

  retrieve_credential() {
    const credential = JSON.parse(sessionStorage.getItem(this.CREDENTIAL_STORAGE) as string);
    this.credential$.next(credential);
  }

  set_credential(crendential: any): void {
    this.credential$.next(crendential);
    sessionStorage.setItem(this.CREDENTIAL_STORAGE, JSON.stringify(crendential));
  }

  set(user: any): void {
    this.user$.next(user);
  }

  get(): Observable<any> {
    return this.user$.asObservable();
  }

  credential(): Observable<any> {
    return this.credential$.asObservable();
  }

}
