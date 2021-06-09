import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormAbstractFieldComponent } from '../form-abstract-field/form-abstract-field.component';
declare var $: any;
@Component({
  selector: 'form-number-field',
  templateUrl: './form-number-field.component.html',
  styleUrls: ['./form-number-field.component.scss']
})
export class FormNumberFieldComponent extends FormAbstractFieldComponent implements OnInit {

  @Input() max: number = 336;

  @Input() min: number = 0;

  @Input() currency: String = '';

  @Output('focusOut') focusOut: EventEmitter<any> = new EventEmitter();

  @Input() decimals: number = 4;
  @Input() separator: string = ',';

  @Input() placement: string = 'p';

  @Input() disabled!: boolean;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $(this.field.nativeElement).autoNumeric({ mDec: this.decimals, aSep: this.separator });
  }

  update(e: any) {
    this.fieldControl.patchValue(e.target.value);
  }

  onFocusOut(event: any) {
    this.focusOut.emit(event)
  }
}
