import { PipeTransform, Pipe, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import * as moment from 'moment';

export class DateUtils{
    static toUTC (date?: Date): Date {
      return date || new Date();//DateUtils.utcStringToDate(date ? date.toUTCString() : new Date().toUTCString());
    }
  
    static toLocal (date: Date): Date {
      return new Date(date.toUTCString());
    }
  
    static utcStringToLocal (utcStr: string ): Date {
      return new Date(utcStr.substr(0, 25).trim() + ' GMT');
    }
  
    static utcStringToDate (utcStr: string): Date {
      return new Date(utcStr.substr(0, 25));
    }
  
    static dateOnly(date? : any): String {
      var dd = date.getDate();
      var mm = date.getMonth()+1; 
      var yyyy = date.getFullYear();
      var finalDD;
      var finalMM;
  
      if(mm < 10) { finalMM = '0' + mm; } else { finalMM = mm;}
      if(dd < 10) { finalDD = '0' + dd; } else { finalDD = dd }
      
      return (finalMM+'/'+finalDD+'/'+yyyy)
    }
  
    static timeOnly(date? : any): String {
      var hh = date.getHours();
      var mm = date.getMinutes()+1;     
      var finalMM;
      var finalHH;
  
      if(mm < 10) { finalMM = '0' + mm; } else { finalMM = mm; }
      if(hh < 10) { finalHH = '0' + hh; } else { finalHH = hh; }
  
      return (finalHH+':'+finalMM)
    }
  
    static timeInNumbers(date?: any): Object {
      var hh = date.getHours();
      var mm = date.getMinutes() + 1;
      var finalMM;
      var finalHH;
  
      if (mm < 10) { finalMM = '0' + mm; } else { finalMM = mm; }
      if (hh < 10) { finalHH = '0' + hh; } else { finalHH = hh; }
  
      return {
        hours: parseInt(finalHH),
        minutes : parseInt(finalMM)
      }
    }
  }

// @Pipe({
//     name: 'offerCount'
// })
// export class OfferCountPipe implements PipeTransform {
//     transform(params: any): Observable<any> {
//         // console.log('OfferCountPipe', params);
//         return this.offer.count(params.bidId, params.productId).pipe(take(1));
//     }
//     constructor(private offer: OfferService) { }
// }

@Pipe({
    name: 'isBeforeToday'
})
export class IsBeforeToday implements PipeTransform {
    transform(value: any): any {
        return moment(value).isBefore(moment(new Date()));
    }
}




@Pipe({
    name: 'objectKeys'
})
export class ObjectKeys implements PipeTransform {
    transform(value: any): any {
        return Object.keys(value).sort();
    }
}


@Pipe({
    name: 'nocomma'
})
export class NoComma implements PipeTransform {
    transform(value: any): any {
        if (!value) return 0;
        return value.toString().replace(/,/g, "");
    }
}


@Pipe({
    name: 'processingFee',
    pure: false
})
export class ProcessingFeePipe implements PipeTransform {
    transform(checkoutItems: any): any {
        return checkoutItems.reduce((pFee: any, item: any) => {
            const itemPFee = item.currentPrice.subtotal * (item.transaction.processingRate / 100);
            return pFee + itemPFee;
        }, 0);
    }
}


// @Pipe({
//     name: 'transactionCost',
//     pure: false
// })
// export class TransactionCostPipe implements PipeTransform {
//     transform(checkoutItems: any): any {
//         const pFee = checkoutItems.reduce((pFee: any, item: any) => {
//             const itemPFee = item.currentPrice.subtotal * (item.transaction.processingRate / 100);
//             return pFee + itemPFee;
//         }, 0);

//         const subtotal = checkoutItems.reduce((subtotal: any, item: any) => {
//             const taxRate = item.transaction.taxType == TaxRateType.VAT_REGISTERED ? 1.12 : 1;
//             const itemSubtotal = item.currentPrice.subtotal * taxRate;
//             return subtotal + itemSubtotal;
//         }, 0);

//         return pFee + subtotal;

//     }
// }

@Pipe({
    name: 'checkSelected',
    pure: false
})
export class CheckSelectedPipe implements PipeTransform {
    transform(offer: any, selected: any): any {
        if (!selected) return false;
        return selected.some((item: any) => item.id == offer.id && item.alias == offer.alias);
    }
}

// @Pipe({
//     name: 'nextShippingStatus',
//     pure: false
// })
// export class NextShippingStatusPipe implements PipeTransform {
//     shippingStatus: any = [
//         PaymentStatus.FOR_DELIVERY,
//         PaymentStatus.IN_TRANSIT,
//         PaymentStatus.PRODUCT_DELIVERED,
//     ];

//     transform(status: any): any {
//         const statusIdx: number = this.shippingStatus.indexOf(status);
//         return this.shippingStatus[statusIdx + 1];
//     }
// }

@Pipe({
    name: 'float'
})
export class FloatPipe implements PipeTransform {
    transform(value: any): any {
        let temp = (typeof value == 'string') ? Number(value.replace(/[^0-9\.-]+/g, "")) : value;
        return (temp) ? temp : 0;
    }
}


// @Pipe({
//     name: 'transactionInfo'
// })
// export class TransactionInfoPipe implements PipeTransform {
//     transform(transaction: any) {
//         const result = {
//             taxRateType: transaction.taxType,
//             taxRate: transaction.taxType !== TaxRateType.VAT_REGISTERED ? 1 : 1.12,
//             currency: transaction.currency,
//             processingRate: transaction.isSpecialUser ? 0.01 : transaction.processingRate / 100,
//             advisor : (transaction.hasOwnProperty('advisor')) ? transaction.advisor : {},
//             payment: (transaction.hasOwnProperty('payment')) ? transaction.payment : {}
//         };
//         return result;
//     }
// }
