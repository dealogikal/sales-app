import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { combineLatest } from 'rxjs';
import { filter, map, skip, take } from 'rxjs/operators';
import { AccountType } from 'src/app/helpers/classes/classes';
import { UserService } from 'src/app/services/user.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private user: UserService,
    private users: UsersService,
    private iziToast: NgxIzitoastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.user.get().pipe(
      filter(user => user),
      take(1)).subscribe(user => {
      switch (user.accountType) {
        case AccountType.BUYER:
          this.router.navigate(['home/b']);
          break;
        case AccountType.SELLER:
          this.router.navigate(['home/s']);
          break;
      }
    })
  }

  onSubmit(): void {
    console.log('submit');
    this.users.get().pipe(
      filter(users => users),
      take(1),
      map((users) => {
        console.log('users >>>', users,)
        const credential = this.form.value;
        const user = users.find((user: any) => user.emails[0].address == credential.email && user.password == credential.password);
        return user;
      })).subscribe(user => {
        console.log('user >>>', user)
        if (!user) {
          this.iziToast.show({
            title: 'ERROR',
            titleColor: '#933432',
            titleSize: '13',
            message: 'User not found',
            messageColor: '#933432',
            messageSize: '13',
            position: 'bottomRight',
            backgroundColor: '#fddddd',
          });
          return;
        }

        this.user.set(user);

        switch (user.accountType) {
          case AccountType.BUYER:
            this.router.navigate(['home/b']);
            break;
          case AccountType.SELLER:
            this.router.navigate(['home/s']);
            break;
        }
      })
  }

}
