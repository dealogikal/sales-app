import { Component, OnInit, Input, HostListener, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { FormAbstractFieldComponent } from '../form-abstract-field/form-abstract-field.component';

@Component({
  selector: 'form-switch-field',
  templateUrl: './form-switch-field.component.html',
  styleUrls: ['./form-switch-field.component.scss']
})
export class FormSwitchFieldComponent extends FormAbstractFieldComponent implements OnInit {

  $value!: Subscription;

  constructor() {
    super();
  }

  ngOnDestroy() {
    this.$value.unsubscribe();
  }

  ngOnInit() {
    this.$value = this.fieldControl.valueChanges.subscribe(e => {
      this.on = e;
    });
  }

  @HostBinding('class.__on') on: boolean = false;

  @HostListener('click', ['$event'])
  onClick(e: any) {
    this.fieldControl.patchValue(!this.fieldControl.value);
  }

}
