import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AccountType } from 'src/app/helpers/classes/classes';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class BuyerGuard implements CanActivate {
  constructor(
    private user: UserService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.user.get().pipe(
      tap(user => {
        if (!user) this.router.navigate(['login']);
      }),
      map((user: any) => user.accountType == AccountType.BUYER)
    );
  }

}
