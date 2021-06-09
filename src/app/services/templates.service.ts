import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  TEMPLATES_STORAGE = 'demo_templates_storage';

  templates$: BehaviorSubject<any> = new BehaviorSubject([
    { "_id": "g9fcWgvbAXcYBWy4m", "startDate": "05/10/2021", "startTime": "2:25 PM", "duration": "40", "commodity": "Petroleum", "shippingMethod": "Deliver", "isSameLocation": true, "payment": { "method": "Cash before delivery", "option": "Bank Transfer", "channel": "Upload deposit slip" }, "products": [{ "product": "Automotive Diesel Oil", "type": "", "qty": "12,000", "unit": "Liters", "shipping": { "location": "LapuLapu", "region": "Region VII - Central Visayas", "province": "Cebu", "schedules": [{ "id": "NAN8393F5F", "qty": "12,000", "unit": "Liters" }] }, "notes": "test", "participants": [{ "id": "95q2JT5dEsxJXDjTT", "email": "dealo.seller.a@gmail.com", "groupName": "sa company", "companyName": "sa company", "mobileNo": { "countryCode": "63", "number": "9171340492" } }, { "id": "SLKGfEbgH5cdQxPGe", "email": "dealo.seller.b@gmail.com", "groupName": "sb company", "companyName": "sb company", "mobileNo": { "countryCode": "63", "number": "9171340492" } }, { "id": "tsaHotNiDraDRGe3Z", "email": "dealo.seller.c@gmail.com", "groupName": "sc company", "companyName": "sc company", "mobileNo": { "countryCode": "63", "number": "9171340492" } }], "attachments": [], "id": "KO8AVZQO6750G98" }, { "product": "Unleaded Gasoline", "type": "", "qty": "8,000", "unit": "Liters", "shipping": { "location": "LapuLapu", "region": "Region VII - Central Visayas", "province": "Cebu", "schedules": [{ "id": "NAN4319ODC", "qty": "8,000", "unit": "Liters" }] }, "notes": "test", "participants": [{ "id": "95q2JT5dEsxJXDjTT", "email": "dealo.seller.a@gmail.com", "groupName": "sa company", "companyName": "sa company", "mobileNo": { "countryCode": "63", "number": "9171340492" } }, { "id": "SLKGfEbgH5cdQxPGe", "email": "dealo.seller.b@gmail.com", "groupName": "sb company", "companyName": "sb company", "mobileNo": { "countryCode": "63", "number": "9171340492" } }, { "id": "tsaHotNiDraDRGe3Z", "email": "dealo.seller.c@gmail.com", "groupName": "sc company", "companyName": "sc company", "mobileNo": { "countryCode": "63", "number": "9171340492" } }], "attachments": [], "id": "KO8AVZQO9879R1K" }], "name": "test", "user": { "id": "7vTnSFgXAWCegXyPc" }, "status": "Active", "dateCreated": { "$date": "2021-04-30T01:03:18.945Z" }, "lastUpdate": { "$date": "2021-05-03T07:48:45.502Z" } }
  ]);

  get(): Observable<any> {
    return this.templates$.asObservable();
  }

  find(id: string): Observable<any> {
    console.log('find', id);
    if (!id) {
      return new Observable((obs) => {
        obs.next(undefined);
        obs.complete();
      })
    }
    return this.templates$.pipe(
      take(1),
      map((templates: any) => {
        const template = templates.find((template: any) => template._id == id);
        console.log('template', templates);
        return template;
      })
    );
  }

  retrieve(): void {
    const templates = JSON.parse(sessionStorage.getItem(this.TEMPLATES_STORAGE) as string);
    this.templates$.next(templates || this.templates$.value);
  }

  save(template: any): Observable<any> {
    console.log('save', template);
    return this.templates$.pipe(
      take(1),
      map(templates => {
        
        const date = new Date();
        if (template._id) {
          const templateIndex = templates.findIndex((t: any) => t._id == template._id);
          template.lastUpdate = date;
          templates[templateIndex] = template;

          console.log('update >>>', template, templateIndex);
        } else {
          const id = (Date.now().toString(36) + Math.floor(1000 + Math.random() * 9000) + Math.random().toString(36).substr(2, 3)).toUpperCase();
          template._id = id;
          template.dateCreated = date;
          template.lastUpdate = date;
          console.log('new >>>', template);
          templates.push(template);
        }
        return templates
      }),
      tap(templates => {
        console.log('saved', templates);
        this.templates$.next(templates);
        sessionStorage.setItem(this.TEMPLATES_STORAGE, JSON.stringify(templates));
      })
    )
  }

  constructor() {
    this.retrieve();
  }

}
