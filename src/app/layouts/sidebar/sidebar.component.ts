import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  routes: any = {
    'Buyer': [
      {
        label: 'New Order',
        link: 'b/new-order',
        icon: 'plus',
        highlight: true,
      },
      {
        label: 'My Orders',
        link: 'b/my-orders',
        icon: 'shopping-cart'
      },
      {
        label: 'User Settings',
        link: 'b/user-settings',
        icon: 'settings'
      }
    ],
    'Seller': [
      {
        label: 'Open for Auction',
        link: 's/open-for-auction',
        icon: 'package'
      },
      {
        label: 'My Offers',
        link: 's/my-offers',
        icon: 'briefcase'
      },
      {
        label: 'User Settings',
        link: 's/user-settings',
        icon: 'settings'
      }
    ]
  }


  routes$: Observable<any> = new Observable();

  constructor(
    private user: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.routes$ = this.user.get().pipe(
      filter(user => user),
      map((user: any) => {
        // console.log('user.accountTYpe MD', user.accountType)
        const routes = this.routes[user.accountType];
        // console.log(routes);
        return routes
      })
    );
  }

  onLogout():void {
    this.user.logout();
    this.router.navigate(['login']);
  }

}
