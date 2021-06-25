import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, map, skipWhile, startWith, switchMap, take } from 'rxjs/operators';

@Component({
    selector: 'form-order-filter',
    templateUrl: './form-order-filter.component.html',
    styleUrls: ['./form-order-filter.component.scss']
})
export class FormOrderFilterComponent implements OnInit {

    formGroup: FormGroup;
    statuses: Array<any> = ['OPEN', 'FOR APPROVAL', 'WAITING', 'AUCTION ENDED', 'TO PAY', 'TO SHIP', 'CLOSED', 'OVERDUE', 'REJECTED', 'EXPIRED'];

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