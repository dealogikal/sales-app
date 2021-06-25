import { Component, HostBinding, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { NavigatorService } from 'src/app/services/navigator.service';
import { UserService } from 'src/app/services/user.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  @HostBinding('class.open') open: boolean = true;
  
  constructor(
    private user: UserService,
    private users: UsersService,
    private navigator: NavigatorService
  ) { }

  ngOnInit(): void {
    this.navigator.getToggle().subscribe(open => {
      this.open = open;
    })
  }

}
