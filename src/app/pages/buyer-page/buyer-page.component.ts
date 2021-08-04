import { Component, OnInit } from '@angular/core';
import { BuyerCronService } from 'src/app/services/buyer-cron.service';

@Component({
  selector: 'buyer-page',
  templateUrl: './buyer-page.component.html',
  styleUrls: ['./buyer-page.component.scss']
})
export class BuyerPageComponent implements OnInit {

  constructor(
    private cron: BuyerCronService
  ) { }

  ngOnInit(
  ): void {
  }

}
