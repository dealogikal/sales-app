import { Component, OnInit, Input } from '@angular/core';
import { FormAbstractFieldComponent } from '../form-abstract-field/form-abstract-field.component';

@Component({
  selector: 'form-textarea-field',
  templateUrl: './form-textarea-field.component.html',
  styleUrls: ['./form-textarea-field.component.scss']
})
export class FormTextareaFieldComponent extends FormAbstractFieldComponent implements OnInit {

  @Input() maxLines!: number;
  @Input() maxLength: number = 256;
  
  constructor() {
    super();
  }

  ngOnInit() {
  }

}
