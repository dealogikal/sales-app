import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  template: ''
})
export class FormAbstractFieldComponent {
  @Input() fieldControl!: FormControl;
  @Input() placeholder: String = '';
  @Input() label: String = '';
  @Input() mask: String = '';
  @ViewChild('field') field!: ElementRef;


}
