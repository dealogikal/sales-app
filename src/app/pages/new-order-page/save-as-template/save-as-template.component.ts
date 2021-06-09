import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, startWith, switchMap, take } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { NewOrderService } from 'src/app/services/new-order.service';
import { TemplatesService } from 'src/app/services/templates.service';

@Component({
    selector: 'save-as-template',
    templateUrl: './save-as-template.component.html',
    styleUrls: ['./save-as-template.component.scss']
})
export class SaveAsTemplateComponent implements OnInit {

    formGroup: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private order: NewOrderService,
        private template: TemplatesService,
        private iziToast: NgxIzitoastService,

    ) {
        this.formGroup = this.formBuilder.group({
            name: ['', Validators.required]
        });
    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }

    onSave() {
        if (!this.formGroup.valid) {
            // UtilsForm.showError(
            //     "Error",
            //     `Template name is required`
            // );
            return;
        }
        this.iziToast.show({
            title: 'Save Template',
            message: `Are you sure you want to save this template?`,
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
                            // $(".loaderModal").modal({
                            //     backdrop: "static",
                            //     keyboard: false,
                            // });
                            this.order.get().pipe(take(1)).subscribe(order => {
                                // console.log('order >>>', order);
                                order.name = this.formGroup.value.name;
                                delete order._id;
                                delete order.lastUpdate;
                                delete order.dateCreated;
                                this.template.save(order).subscribe((id) => {
                                    setTimeout(() => {
                                        // $(".loaderModal").modal("hide");
                                        this.route.params.pipe(take(1)).subscribe(params => {
                                            // console.log(params);
                                            if (params.template_id) {
                                                this.router.navigate(['../../', id], { relativeTo: this.route });
                                                return;
                                            }
                                            this.router.navigate(['../', id], { relativeTo: this.route });
                                        })
                                    }, 1000);
                                });
                            });
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