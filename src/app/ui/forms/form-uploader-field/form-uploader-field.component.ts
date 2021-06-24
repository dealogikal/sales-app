import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormAbstractFieldComponent } from '../form-abstract-field/form-abstract-field.component';
import { distinctUntilChanged } from 'rxjs/operators';
import { cloudinaryConfig, uploaderOptionsRaw } from 'src/app/helpers/classes/classes';
import * as moment from 'moment';
import { FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';

enum STATUS {
  UPLOADING = 'Uploading',
  DEFAULT = 'Drag & Drop to Upload',
  DONE = 'Upload Complete'
}

@Component({
  selector: 'form-uploader-field',
  templateUrl: './form-uploader-field.component.html',
  styleUrls: ['./form-uploader-field.component.scss']
})
export class FormUploaderFieldComponent extends FormAbstractFieldComponent implements OnInit {

  @HostBinding('class.success') success!: boolean;

  uploader!: FileUploader;

  status: STATUS = STATUS.DEFAULT;

  Status = STATUS;

  filename!: string;

  constructor() {
    super();
  }

  ngOnInit() {

    this.uploader = new FileUploader(uploaderOptionsRaw);


    if (this.fieldControl.value && this.fieldControl.value.url) {
      this.filename = this.fieldControl.value.publicID.replace('registration-files/', '');
      this.status = STATUS.DONE;
      this.success = true;
    }

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      this.status = STATUS.UPLOADING;
      this.success = false;
      let tags = `registration,documents`;
      form.append('upload_preset', cloudinaryConfig.upload_preset);
      form.append('folder', 'registration-files');
      form.append('tags', tags);
      form.append('file', fileItem);
      fileItem.withCredentials = false;

      this.filename = fileItem.file.name;

      // console.log('fileItem', fileItem);
      return { fileItem, form };
    };

    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {

      let res = JSON.parse(response);
      let file = {
        publicID: res.public_id,
        secureUrl: res.secure_url,
        url: res.url,
        date: moment(new Date()).format()
      }

      this.status = STATUS.DONE;
      this.success = true;
      if (this.fieldControl) this.fieldControl.patchValue(file);
      // console.log('UploaderComponent', file);
    }

    // Update model on upload progress event
    this.uploader.onProgressItem = (fileItem: any, progress: any) => {
      // console.log('progress', progress);
    }

    this.fieldControl.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
      console.log('uploader 1', value);
      if (!value || !Object.keys(value).length) {
        this.filename = '';
        this.status = STATUS.DEFAULT;
        this.success = false;
        return;
      }
      this.filename = value.publicID.replace('registration-files/', '');
      console.log('uploader 2', this.filename);
      this.status = STATUS.DONE;
      this.success = true;
      // this.fieldControl.patchValue(value);
    });

  }

  selectFile(inputFile: any) {
    if (this.status !== STATUS.UPLOADING) inputFile.click();
  }

}
