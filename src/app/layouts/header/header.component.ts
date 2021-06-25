import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NavigatorService } from 'src/app/services/navigator.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user$!: Observable<any>;

  constructor(
    private user: UserService,
    private navigator: NavigatorService
  ) { }

  ngOnInit(): void {
    this.user$ = this.user.get();

    this.user$.subscribe(e => console.log(e))
  }


  toggleMenu() {
    this.navigator.toggleMenu();
  }

}
