import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, skip, take } from 'rxjs/operators';
import { TemplatesService } from 'src/app/services/templates.service';

@Component({
  selector: 'templates-page',
  templateUrl: './templates-page.component.html',
  styleUrls: ['./templates-page.component.scss']
})
export class TemplatesPageComponent implements OnInit {


  $routeParams!: Subscription;

  templates$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templates: TemplatesService
  ) {
  }

  ngOnDestroy() {
    if (this.$routeParams) {
      this.$routeParams.unsubscribe();
    }

  }

  ngOnInit() {
    this.templates$ = this.templates.get().pipe(
      map((templates) => {
        console.log('templates', templates);
        return templates.sort((a: any, b: any) => b.lastUpdate - a.lastUpdate);
      })
    );

  }

  onSelect(template: any) {
    this.route.params.pipe(take(1)).subscribe(params => {
      if (params.template_id) {
        this.router.navigate(['../../', template._id], { relativeTo: this.route });
        return;
      }
      this.router.navigate(['../', template._id], { relativeTo: this.route });
    });
  }

}
