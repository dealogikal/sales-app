import { Component, OnInit } from '@angular/core';
import { SellerCronService } from 'src/app/services/seller-cron.service';

@Component({
  selector: 'seller-page',
  templateUrl: './seller-page.component.html',
  styleUrls: ['./seller-page.component.scss']
})
export class SellerPageComponent implements OnInit {

  constructor(
    private cron: SellerCronService
  ) { }

  ngOnInit(): void {
  }

}
