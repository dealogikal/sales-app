import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormAbstractFieldComponent } from '../form-abstract-field/form-abstract-field.component';
declare var $: any;
@Component({
  selector: 'form-time-field',
  templateUrl: './form-time-field.component.html',
  styleUrls: ['./form-time-field.component.scss']
})
export class FormTimeFieldComponent extends FormAbstractFieldComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    $(this.field.nativeElement).timepicker({
      'minuteStep': 5
    }).on('show.timepicker', () => {
      var widget = $('.bootstrap-timepicker-widget');
      var getTime = $(this.field.nativeElement).data("timepicker").getTime();

      // widget.attr('style', 'z-index: 1051 !important');


      console.log('getTime >>>', getTime);

      $(this.field.nativeElement).val(getTime);

      widget.find('.glyphicon-chevron-up').removeClass().addClass('pg-arrow_maximize');
      widget.find('.glyphicon-chevron-down').removeClass().addClass('pg-arrow_minimize');

    }).trigger('change');

    $(this.field.nativeElement).click(() => {
      var time = $(this.field.nativeElement).timepicker('showWidget');
    });

    $(this.field.nativeElement).change((e: { target: { value: any; }; }) => {
      this.fieldControl.patchValue(e.target.value);
    });

  }

}
