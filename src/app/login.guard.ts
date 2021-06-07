import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './services/user.service';
import { UsersService } from './services/users.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private users: UsersService,
    private user: UserService
  ) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return combineLatest(
      this.user.credential(),
      this.users.get()
    ).pipe(map(([credential, users]) => {
      const user = users.find((user: any) => user.emails[0].address == credential.email);
      return user;
    }))
  }

}
