import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  templates$: BehaviorSubject<any> = new BehaviorSubject([
    { "_id": "g9fcWgvbAXcYBWy4m", "startDate": "05/10/2021", "startTime": "2:25 PM", "duration": "40", "commodity": "Petroleum", "shippingMethod": "Deliver", "isSameLocation": true, "payment": { "method": "Cash before delivery", "option": "Bank Transfer", "channel": "Upload deposit slip" }, "products": [{ "product": "Automotive Diesel Oil", "type": "", "qty": "12,000", "unit": "Liters", "shipping": { "location": "LapuLapu", "region": "Region VII - Central Visayas", "province": "Cebu", "schedules": [{ "id": "NAN8393F5F", "qty": "12,000", "unit": "Liters" }] }, "notes": "test", "participants": [{ "id": "95q2JT5dEsxJXDjTT", "email": "dealo.seller.a@gmail.com", "groupName": "sa company", "companyName": "sa company", "mobileNo": { "countryCode": "63", "number": "9171340492" } }, { "id": "SLKGfEbgH5cdQxPGe", "email": "dealo.seller.b@gmail.com", "groupName": "sb company", "companyName": "sb company", "mobileNo": { "countryCode": "63", "number": "9171340492" } }, { "id": "tsaHotNiDraDRGe3Z", "email": "dealo.seller.c@gmail.com", "groupName": "sc company", "companyName": "sc company", "mobileNo": { "countryCode": "63", "number": "9171340492" } }], "attachments": [], "id": "KO8AVZQO6750G98" }, { "product": "Unleaded Gasoline", "type": "", "qty": "8,000", "unit": "Liters", "shipping": { "location": "LapuLapu", "region": "Region VII - Central Visayas", "province": "Cebu", "schedules": [{ "id": "NAN4319ODC", "qty": "8,000", "unit": "Liters" }] }, "notes": "test", "participants": [{ "id": "95q2JT5dEsxJXDjTT", "email": "dealo.seller.a@gmail.com", "groupName": "sa company", "companyName": "sa company", "mobileNo": { "countryCode": "63", "number": "9171340492" } }, { "id": "SLKGfEbgH5cdQxPGe", "email": "dealo.seller.b@gmail.com", "groupName": "sb company", "companyName": "sb company", "mobileNo": { "countryCode": "63", "number": "9171340492" } }, { "id": "tsaHotNiDraDRGe3Z", "email": "dealo.seller.c@gmail.com", "groupName": "sc company", "companyName": "sc company", "mobileNo": { "countryCode": "63", "number": "9171340492" } }], "attachments": [], "id": "KO8AVZQO9879R1K" }], "name": "test", "user": { "id": "7vTnSFgXAWCegXyPc" }, "status": "Active", "dateCreated": { "$date": "2021-04-30T01:03:18.945Z" }, "lastUpdate": { "$date": "2021-05-03T07:48:45.502Z" } }
  ]);

  get(): Observable<any> {
    return this.templates$.asObservable();
  }

  constructor() { }
}
