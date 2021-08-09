import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'form-offer-filter',
  templateUrl: './form-offer-filter.component.html',
  styleUrls: ['./form-offer-filter.component.scss']
})
export class FormOfferFilterComponent implements OnInit {

  formGroup: FormGroup;
  statuses: Array<any> = ['OPEN', 'FOR APPROVAL', 'FOR VALIDATION', 'PAYMENT', 'SHIPPING', 'CLOSED', 'LOST', 'REJECTED', 'EXPIRED'];

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder
  ) {
      this.formGroup = this.formBuilder.group({
          status: [[]],
          from: [''],
          to: ['']
      })
  }

  ngOnInit() {

      this.route.queryParams.pipe(take(1)).subscribe(params => {
          let _params = JSON.parse(JSON.stringify(params));
          if (typeof _params.status == 'string') {
              _params.status = [_params.status];
          }
          this.formGroup.patchValue(_params);
      });
  }

  onApply() {
      this.router.navigate(['../'], {
          relativeTo: this.route, queryParams: this.formGroup.value, queryParamsHandling: 'merge'
      });
  }

}
