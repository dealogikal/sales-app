import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { FormArray, FormControl } from '@angular/forms';
import { FormAbstractFieldComponent } from '../form-abstract-field/form-abstract-field.component';
import { distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { cloudinaryConfig, uploaderOptionsRaw } from 'src/app/helpers/classes/classes';
import * as moment from 'moment';
import { NgxIzitoastService } from 'ngx-izitoast';


@Component({
  selector: 'form-attachments-field',
  templateUrl: './form-attachments-field.component.html',
  styleUrls: ['./form-attachments-field.component.scss']
})
export class FormAttachmentsFieldComponent implements OnInit {

  loading$: BehaviorSubject<any> = new BehaviorSubject(false);

  @HostBinding('class.success') success!: boolean;

  uploader!: FileUploader;


  @Input() formArray!: FormArray;

  constructor(
    private iziToast: NgxIzitoastService,
  ) {
  }

  ngOnInit() {
    // if (!this.formArray.value.length) {
    //   console.log
    // }

    this.uploader = new FileUploader(uploaderOptionsRaw);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      this.loading$.next(true);
      let tags = `attachments,documents`;
      form.append('upload_preset', cloudinaryConfig.upload_preset);
      form.append('folder', 'attachments');
      form.append('tags', tags);
      form.append('file', fileItem);
      fileItem.withCredentials = false;
      console.log('onBuildItemForm', fileItem);
      return {
        fileItem,
        form
      };
    };

    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {

      let res = JSON.parse(response);

      let file = new FormControl({
        publicID: res.public_id,
        secureUrl: res.secure_url,
        url: res.url,
        date: moment(new Date()).format()
      });

      this.formArray.push(file);
      this.loading$.next(false);
      console.log(this.formArray.value);
    }


  }

  selectFile(inputFile: any) {
    inputFile.click();
  }

  onRemove(index: number) {
    this.iziToast.show({
      title: 'Remove Attachment',
      message: `Are you sure you want to remove this attachment?`,
      position: 'center',
      closeOnEscape: false,
      close: false,
      overlay: true,
      timeout: 0,
      buttons: [
        ['<button>Confirm</button>', (instance: any, toast: any) => {
          instance.hide({
            transitionOut: 'fadeOutUp',
            onClosing: (instance: any, toast: any, closedBy: any) => {

              this.formArray.removeAt(index);

            }
          }, toast, 'buttonName');
        }, true],
        ['<button>Cancel</button>', (instance: any, toast: any) => {
          instance.hide({
            transitionOut: 'fadeOutUp'
          }, toast, 'buttonName');
        }]
      ],
    });
  }

}
