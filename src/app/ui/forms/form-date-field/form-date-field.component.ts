import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormAbstractFieldComponent } from '../form-abstract-field/form-abstract-field.component';
declare var $: any;
@Component({
  selector: 'form-date-field',
  templateUrl: './form-date-field.component.html',
  styleUrls: ['./form-date-field.component.scss']
})
export class FormDateFieldComponent extends FormAbstractFieldComponent implements OnInit {

  @Input() startDate: any;
  @Input() endDate: any;
  @Input() default: boolean = false;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let config: any = {};
    if (this.startDate || this.startDate == 'today') config.startDate = new Date();
    if (this.endDate || this.endDate == 'today') config.endDate = new Date();

    $(this.field.nativeElement).datepicker(config).trigger('change');

    $(this.field.nativeElement).change((e: any) => {
      this.fieldControl.patchValue(e.target.value);
    });
  }

}
