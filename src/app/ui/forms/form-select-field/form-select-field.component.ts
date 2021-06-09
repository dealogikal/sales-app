import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormAbstractFieldComponent } from '../form-abstract-field/form-abstract-field.component';
import { distinctUntilChanged, skip, filter, map, debounceTime } from 'rxjs/operators';
import { Subscription, combineLatest, Observable, BehaviorSubject } from 'rxjs';
declare var $: any;
@Component({
  selector: 'form-select-field',
  templateUrl: './form-select-field.component.html',
  styleUrls: ['./form-select-field.component.scss']
})
export class FormSelectFieldComponent extends FormAbstractFieldComponent implements OnInit {

  
  @Input()
  set options(value: Array<any>) {
    this.options$.next(value);
  }

  @Input() multiple: boolean = false;

  @Input() tags: boolean = false;

  @Input() disabled: boolean = false;

  $fieldValue: Subscription | undefined;

  options$: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor() {
    super();
  }

  ngOnInit() {
    this.$fieldValue = combineLatest(
      this.fieldControl!.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged((prev, curr) => {
          const _prev = (() => {
            if (typeof prev == 'object') {
              return JSON.stringify(prev);
            }
            return prev
          })();

          const _curr = (() => {
            if (typeof curr == 'object') {
              return JSON.stringify(curr);
            }
            return curr
          })();
          // console.log('_curr', _curr);
          // console.log('_prev', _prev);
          return _curr == _prev;
        })
      ),
    ).subscribe(([value]) => {
      // console.log('fieldValue 1', value);
      const result = (() => {

        if (typeof value == 'object') {
          if (!value) return value;
          return value.map((a: any) => {
            if (typeof a == 'object') return JSON.stringify(a);
            return a;
          });
        }
        return value
      })();
      // console.log('fieldValue 2', result);
      $(this.field!.nativeElement).val(result)
      // console.log('fieldValue 3', $(this.field.nativeElement).val());
      $(this.field!.nativeElement).trigger('change.select2');
      // console.log('fieldValue 4', $(this.field.nativeElement).val());
      // $(this.field.nativeElement).trigger('change');
    });

    this.options$.subscribe(e => {
      // console.log('options select >>>', e)
    });

  }

  ngAfterViewInit() {
    // $(this.field.nativeElement).select2().trigger('change');

    $(this.field!.nativeElement).select2({
      multiple: this.multiple,
      tags: this.tags,
      tokenSeparators: [',']
    });

    // console.log('disbabled > ', this.disabled)

    $(this.field!.nativeElement).change((e: any) => {
      const field_value = (() => {
        if (typeof $(this.field!.nativeElement).val() == 'object') {
          if (!$(this.field!.nativeElement).val()) return $(this.field!.nativeElement).val();
          return $(this.field!.nativeElement).val().filter((a: any) => !!a).map((i : any) => {
            console.log('form field >>>', i);
            try {
              return JSON.parse(i);
            } catch {
              return i;
            }
          })
        }

        return $(this.field!.nativeElement).val();
      })();
      console.log('field_value', field_value);
      $(this.field!.nativeElement).val = field_value;
      // console.log('ngAfterViewInit 1', field_value);
      this.fieldControl!.patchValue(field_value);
      this.fieldControl!.markAsDirty();


    });
    

  }



}
