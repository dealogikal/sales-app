import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { filter, map, skip, take } from 'rxjs/operators';
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
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
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
      })
  }

}
