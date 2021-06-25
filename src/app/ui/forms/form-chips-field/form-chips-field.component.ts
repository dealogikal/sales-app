import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'form-chips-field',
  templateUrl: './form-chips-field.component.html',
  styleUrls: ['./form-chips-field.component.scss']
})
export class FormChipsFieldComponent implements OnInit {

  @Input() fieldControl!: FormControl;

  selected: any[] = [];

  $value!: Subscription;

  value$: BehaviorSubject<string> = new BehaviorSubject('');

  option$: BehaviorSubject<any> = new BehaviorSubject([]);

  options_!: any[];
  get options() {
    return this.option$.value;
  }

  @Input() set options(value: any) {
    const options = value.map((option: any) => {
      return {
        value: option,
        name: option.name ? option.name : option,
        selected: false
      }
    });

    this.option$.next(options);
    this.options_ = options;
  }


  get value() {
    return this.value$.value;
  }
  
  @Input()
  set value(value: any) {
    this.value$.next(value);
  }


  constructor() { }

  ngOnDestroy() {
    this.$value.unsubscribe();
  }

  ngOnInit() {
    console.log('init chips', this.fieldControl.value);
    if (this.fieldControl.value.length) {
      this.value$.next(this.fieldControl.value)
    }

    this.$value = combineLatest(
      this.value$,
      this.option$,
      (value: any, options) => {
        return {
          value, options
        };
      }
    ).subscribe((a) => {
      if (!!a.value.length && !!a.options.length) {
        this.selected = a.value;
        this.options_ = a.options.map((option: any) => {
          option.selected = false;
          return option;
        }).map((option: any) => {
          const isSelected = a.value.some((item: any) => {
            return item == option.value;
          })
          if (isSelected) option.selected = true;
          return option;
        })
      }
    });

    this.fieldControl.valueChanges.subscribe((values) => {
      this.value$.next(values);
    });

  }

  toggle(option: any, index: number) {
    // console.log(option);
    if (!option.selected) {
      this.options_[index].selected = true;
      this.selected.push(option.value);
      if (this.fieldControl) this.fieldControl.patchValue(this.selected);
      return;
    }
    this.options_[index].selected = false;
    const idx = this.selected.findIndex(a => a == option.value)
    this.selected.splice(idx, 1);
    if (this.fieldControl) this.fieldControl.patchValue(this.selected);
  }

}
