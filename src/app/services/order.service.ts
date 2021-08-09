import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountType, OrderStatus, Pages, PaymentMethods } from '../helpers/classes/classes';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  order$: BehaviorSubject<any> = new BehaviorSubject(undefined);
  get(): Observable<any> {
    return this.order$.asObservable();
  }
  set(order: any): void {
    this.order$.next(order);
  }

  getMessage(page: string): Observable<any> {
    return combineLatest(
      this.get(),
      this.user.get()
    ).pipe(
      map(([order, user]) => {

        console.log('message???', user)
        let msg = '';

        if (user.accountType == AccountType.SELLER) {
          switch (order.status) {
            case OrderStatus.FOR_REVIEW:
            case OrderStatus.FOR_BUYER_PAYMENT:
            case OrderStatus.BUYER_PAYMENT_VERIFICATION:
              msg = "PLEASE WAIT WHILE WE CONFIRM BUYER'S ORDER.";
              break;
            case OrderStatus.SELLER_PAYMENT:
              msg = "PLEASE WAIT WHILE WE PROCESS YOUR PAYMENT.";
              break;
            case OrderStatus.FOR_DELIVERY:
              msg = "PAYMENT HAS BEEN MADE. PLEASE PROCESS THE ORDER FOR DELIVERY.";
              break;
            case OrderStatus.IN_TRANSIT:
              msg = "GREAT! PLEASE DELIVER THE ORDER ON THE REQUESTED LOCATION.";
              break;
            case OrderStatus.PRODUCT_DELIVERED:
              msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED. WAITING FOR BUYER'S CONFIRMATION.";
              break;
            case OrderStatus.CLOSED_DEAL:
              msg = "THANK YOU FOR TRANSACTING WITH US!";
              break;
          }
        }
        else {
          switch (order.payment.method) {
            case PaymentMethods.CBD:
              switch (page) {
                case Pages.BREAKDOWN:
                case Pages.PAYMENT:
                case Pages.SHIPPING:
                  switch (order.status) {
                    case OrderStatus.FOR_BUYER_PAYMENT:
                      msg = 'please pay to proceed';
                      break;
                    case OrderStatus.BUYER_PAYMENT_VERIFICATION:
                    case OrderStatus.SELLER_PAYMENT:
                      msg = "THANK YOU! WE'LL START PROCESSING YOUR ORDER ONCE WE VERIFY YOUR PAYMENT.";
                      break;
                    case OrderStatus.FOR_DELIVERY:
                      msg = "YOUR ORDER IS NOW READY FOR DELIVERY.";
                      break;
                    case OrderStatus.IN_TRANSIT:
                      msg = "YOUR ORDER IS NOW IN TRANSIT.";
                      break;
                    case OrderStatus.PRODUCT_DELIVERED:
                      msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED.";
                      break;
                    case OrderStatus.CLOSED_DEAL:
                      msg = "THANK YOU FOR TRANSACTING WITH US!";
                      break;
                  }
                  break;
              }
              break;
            case PaymentMethods.COD:
              switch (page) {
                case Pages.PAYMENT:
                case Pages.SHIPPING:
                case Pages.BREAKDOWN:
                  switch (order.status) {
                    case OrderStatus.FOR_DELIVERY:
                      msg = "YOUR ORDER IS NOW READY FOR DELIVERY.";
                      break;
                    case OrderStatus.IN_TRANSIT:
                      msg = "YOUR ORDER IS NOW IN TRANSIT";
                      break;
                    case OrderStatus.PRODUCT_DELIVERED:
                      msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED.";
                      break;
                    case OrderStatus.FOR_BUYER_PAYMENT:
                    case OrderStatus.BUYER_PAYMENT_VERIFICATION:
                      msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED. PLEASE WAIT WHILE WE VERIFY YOUR PAYMENT";
                      break;
                    case OrderStatus.CLOSED_DEAL:
                      msg = "THANK YOU FOR TRANSACTING WITH US!";
                      break;
                  }
              }

              break;
          }

        }

        return msg;
      })
    )
    let msg = '';

    // if (paymentMethod.toLowerCase() == PaymentMethod.CBD.toLowerCase()) {
    //   if (accountType == AccountType.BUYER) {
    //     if (page == Pages.BREAKDOWN) {
    //       // switch(status) {          
    //       // }

    //     } else if (page == Pages.PAYMENT || page == Pages.SHIPPING) {
    //       switch (status) {
    //         case PaymentStatus.BUYER_PAYMENT_VERIFICATION:
    //         case PaymentStatus.SELLER_PAYMENT:
    //           msg = "THANK YOU! WE'LL START PROCESSING YOUR ORDER ONCE WE VERIFY YOUR PAYMENT.";
    //           break;
    //         case PaymentStatus.FOR_DELIVERY:
    //           msg = "YOUR ORDER IS NOW READY DELIVERY.";
    //           break;
    //         case PaymentStatus.IN_TRANSIT:
    //           msg = "YOUR ORDER IS NOW IN TRANSIT";
    //           break;
    //         case PaymentStatus.PRODUCT_DELIVERED:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED.";
    //           break;
    //         case PaymentStatus.CLOSED_DEAL:
    //           msg = "THANK YOU FOR TRANSACTING WITH US!";
    //           break;
    //       }

    //     }
    //   } else if (accountType == AccountType.SELLER) {
    //     if (page == Pages.BREAKDOWN) {
    //       switch (status) {
    //         case PaymentStatus.FOR_REVIEW:
    //         case PaymentStatus.FOR_BUYER_PAYMENT:
    //         case PaymentStatus.BUYER_PAYMENT_VERIFICATION:
    //           msg = "PLEASE WAIT WHILE WE CONFIRM BUYER'S ORDER.";
    //           break;
    //         case PaymentStatus.FOR_DELIVERY:
    //           msg = "PAYMENT HAS BEEN MADE. PLEASE PROCESS THE ORDER FOR DELIVERY.";
    //           break;
    //         case PaymentStatus.IN_TRANSIT:
    //           msg = "GREAT! PLEASE DELIVER THE ORDER ON THE REQUESTED LOCATION.";
    //           break;
    //         case PaymentStatus.PRODUCT_DELIVERED:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED. WAITING FOR BUYER'S CONFIRMATION.";
    //           break;
    //         case PaymentStatus.CLOSED_DEAL:
    //           msg = "THANK YOU FOR TRANSACTING WITH US!";
    //           break;
    //       }
    //     } else if (page == Pages.PAYMENT || page == Pages.SHIPPING) {
    //       switch (status) {
    //         case PaymentStatus.FOR_REVIEW:
    //         case PaymentStatus.FOR_BUYER_PAYMENT:
    //         case PaymentStatus.BUYER_PAYMENT_VERIFICATION:
    //           msg = "PLEASE WAIT WHILE WE CONFIRM BUYER'S ORDER.";
    //           break;
    //         case PaymentStatus.SELLER_PAYMENT:
    //           msg = "PLEASE WAIT WHILE WE PROCESS YOUR PAYMENT.";
    //           break;
    //         case PaymentStatus.FOR_DELIVERY:
    //           msg = "PAYMENT HAS BEEN MADE. PLEASE PROCESS THE ORDER FOR DELIVERY.";
    //           break;
    //         case PaymentStatus.IN_TRANSIT:
    //           msg = "GREAT! PLEASE DELIVER THE ORDER ON THE REQUESTED LOCATION.";
    //           break;
    //         case PaymentStatus.PRODUCT_DELIVERED:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED. WAITING FOR BUYER'S CONFIRMATION.";
    //           break;
    //         case PaymentStatus.CLOSED_DEAL:
    //           msg = "THANK YOU FOR TRANSACTING WITH US!";
    //           break;
    //       }

    //     }
    //   } else if (accountType == AccountType.MARKET_MAKER) {
    //     if (page == Pages.BREAKDOWN) {
    //       // switch (status) {          
    //       // }
    //     } else if (page == Pages.PAYMENT || page == Pages.SHIPPING) {
    //       switch (status) {
    //         case PaymentStatus.FOR_BUYER_PAYMENT:
    //           msg = "WAITING FOR PAYMENT.";
    //           break;
    //         case PaymentStatus.BUYER_PAYMENT_VERIFICATION:
    //           msg = "PLEASE CHECK THE DEPOSIT SLIP AND MARK THE BUYER AS PAID ONCE VERIFIED.";
    //           break;
    //         case PaymentStatus.FOR_DELIVERY:
    //           msg = "ORDER IS NOW READY FOR DELIVERY.";
    //           break;
    //         case PaymentStatus.IN_TRANSIT:
    //           msg = "ORDER IS NOW IN TRANSIT.";
    //           break;
    //         case PaymentStatus.PRODUCT_DELIVERED:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED. WAITING FOR BUYER'S CONFIRMATION.";
    //           break;
    //         case PaymentStatus.CLOSED_DEAL:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY CLOSED.";
    //           break;
    //       }

    //     }
    //   }

    // } else if (paymentMethod.toLowerCase() == PaymentMethod.COD.toLowerCase()) {
    //   if (accountType == AccountType.BUYER) {
    //     if (page == Pages.BREAKDOWN) {
    //       switch (status) {
    //         case PaymentStatus.SELLER_PAYMENT:
    //           msg = "PLEASE WAIT WHILE WE VERIFY YOUR ORDER.";
    //           break;
    //         case PaymentStatus.FOR_DELIVERY:
    //           msg = "YOUR ORDER IS NOW READY DELIVERY.";
    //           break;
    //         case PaymentStatus.IN_TRANSIT:
    //           msg = "YOUR ORDER IS NOW IN TRANSIT";
    //           break;
    //         case PaymentStatus.PRODUCT_DELIVERED:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED.";
    //           break;
    //         case PaymentStatus.FOR_BUYER_PAYMENT:
    //         case PaymentStatus.BUYER_PAYMENT_VERIFICATION:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED. PLEASE WAIT WHILE WE VERIFY YOUR PAYMENT";
    //           break;
    //         case PaymentStatus.CLOSED_DEAL:
    //           msg = "THANK YOU FOR TRANSACTING WITH US!";
    //           break;
    //       }

    //     } else if (page == Pages.PAYMENT || page == Pages.SHIPPING) {
    //       switch (status) {
    //         case PaymentStatus.FOR_DELIVERY:
    //           msg = "YOUR ORDER IS NOW READY DELIVERY.";
    //           break;
    //         case PaymentStatus.IN_TRANSIT:
    //           msg = "YOUR ORDER IS NOW IN TRANSIT";
    //           break;
    //         case PaymentStatus.PRODUCT_DELIVERED:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED.";
    //           break;
    //         case PaymentStatus.FOR_BUYER_PAYMENT:
    //         case PaymentStatus.BUYER_PAYMENT_VERIFICATION:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED. PLEASE WAIT WHILE WE VERIFY YOUR PAYMENT";
    //           break;
    //         case PaymentStatus.CLOSED_DEAL:
    //           msg = "THANK YOU FOR TRANSACTING WITH US!";
    //           break;
    //       }

    //     }
    //   } else if (accountType == AccountType.SELLER) {
    //     if (page == Pages.BREAKDOWN) {
    //       switch (status) {
    //         case PaymentStatus.FOR_REVIEW:
    //           msg = "PLEASE WAIT WHILE WE CONFIRM BUYER'S ORDER.";
    //           break;
    //         case PaymentStatus.SELLER_PAYMENT:
    //           msg = "PLEASE WAIT WHILE WE PROCESS YOUR PAYMENT.";
    //           break;
    //         case PaymentStatus.FOR_DELIVERY:
    //           msg = "PAYMENT HAS BEEN MADE. PLEASE PROCESS THE ORDER FOR DELIVERY.";
    //           break;
    //         case PaymentStatus.IN_TRANSIT:
    //           msg = "GREAT! PLEASE DELIVER THE ORDER ON THE REQUESTED LOCATION.";
    //           break;
    //         case PaymentStatus.PRODUCT_DELIVERED:
    //         case PaymentStatus.FOR_BUYER_PAYMENT:
    //         case PaymentStatus.BUYER_PAYMENT_VERIFICATION:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED. WAITING FOR BUYER'S CONFIRMATION.";
    //           break;
    //         case PaymentStatus.CLOSED_DEAL:
    //           msg = "THANK YOU FOR TRANSACTING WITH US!";
    //           break;
    //       }
    //     } else if (page == Pages.PAYMENT || page == Pages.SHIPPING) {
    //       switch (status) {
    //         case PaymentStatus.FOR_REVIEW:
    //           msg = "PLEASE WAIT WHILE WE CONFIRM BUYER'S ORDER.";
    //           break;
    //         case PaymentStatus.SELLER_PAYMENT:
    //           msg = "PLEASE WAIT WHILE WE PROCESS YOUR PAYMENT.";
    //           break;
    //         case PaymentStatus.FOR_DELIVERY:
    //           msg = "PAYMENT HAS BEEN MADE. PLEASE PROCESS THE ORDER FOR DELIVERY.";
    //           break;
    //         case PaymentStatus.IN_TRANSIT:
    //           msg = "GREAT! PLEASE DELIVER THE ORDER ON THE REQUESTED LOCATION.";
    //           break;
    //         case PaymentStatus.PRODUCT_DELIVERED:
    //         case PaymentStatus.FOR_BUYER_PAYMENT:
    //         case PaymentStatus.BUYER_PAYMENT_VERIFICATION:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED. WAITING FOR BUYER'S CONFIRMATION.";
    //           break;
    //         case PaymentStatus.CLOSED_DEAL:
    //           msg = "THANK YOU FOR TRANSACTING WITH US!";
    //           break;
    //       }

    //     }
    //   } else if (accountType == AccountType.MARKET_MAKER) {
    //     if (page == Pages.BREAKDOWN) {
    //       // switch (status) {          
    //       // }
    //     } else if (page == Pages.PAYMENT || page == Pages.SHIPPING) {
    //       switch (status) {
    //         case PaymentStatus.FOR_BUYER_PAYMENT:
    //           msg = "WAITING FOR PAYMENT.";
    //           break;
    //         case PaymentStatus.BUYER_PAYMENT_VERIFICATION:
    //           msg = "PLEASE CHECK THE DEPOSIT SLIP AND MARK THE BUYER AS PAID ONCE VERIFIED.";
    //           break;
    //         case PaymentStatus.FOR_DELIVERY:
    //           msg = "ORDER IS NOW READY FOR DELIVERY.";
    //           break;
    //         case PaymentStatus.IN_TRANSIT:
    //           msg = "ORDER IS NOW IN TRANSIT.";
    //           break;
    //         case PaymentStatus.PRODUCT_DELIVERED:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED. WAITING FOR BUYER'S CONFIRMATION.";
    //           break;
    //         case PaymentStatus.CLOSED_DEAL:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY CLOSED.";
    //           break;
    //       }

    //     }
    //   }

    // } else if (paymentMethod.toLowerCase() == PaymentMethod.TERMS.toLowerCase()) {
    //   if (accountType == AccountType.BUYER) {
    //     if (page == Pages.BREAKDOWN) {
    //       switch (status) {
    //         case PaymentStatus.SELLER_PAYMENT:
    //           msg = "PLEASE WAIT WHILE WE VERIFY YOUR ORDER.";
    //           break;
    //         case PaymentStatus.FOR_DELIVERY:
    //           msg = "YOUR ORDER IS NOW READY DELIVERY.";
    //           break;
    //         case PaymentStatus.IN_TRANSIT:
    //           msg = "YOUR ORDER IS NOW IN TRANSIT";
    //           break;
    //         case PaymentStatus.PRODUCT_DELIVERED:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED.";
    //           break;
    //         case PaymentStatus.FOR_BUYER_PAYMENT:
    //         case PaymentStatus.BUYER_PAYMENT_VERIFICATION:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED. PLEASE WAIT WHILE WE VERIFY YOUR PAYMENT";
    //           break;
    //         case PaymentStatus.CLOSED_DEAL:
    //           msg = "THANK YOU FOR TRANSACTING WITH US!";
    //           break;
    //       }

    //     } else if (page == Pages.PAYMENT || page == Pages.SHIPPING) {
    //       switch (status) {
    //         case PaymentStatus.FOR_DELIVERY:
    //           msg = "YOUR ORDER IS NOW READY DELIVERY.";
    //           break;
    //         case PaymentStatus.IN_TRANSIT:
    //           msg = "YOUR ORDER IS NOW IN TRANSIT";
    //           break;
    //         case PaymentStatus.PRODUCT_DELIVERED:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED.";
    //           break;
    //         case PaymentStatus.FOR_BUYER_PAYMENT:
    //           msg = "PLEASE PAY THE AMOUNT TO THE SELLER ON OR BEFORE DUE DATE";
    //           break;
    //         case PaymentStatus.BUYER_PAYMENT_VERIFICATION:
    //         case 'Paid':
    //         case PaymentStatus.SELLER_PAYMENT:
    //         case PaymentStatus.SELLER_PAYMENT_VERIFICATION:
    //           msg = "PLEASE WAIT WHILE WE NOTIFY THE SELLER TO VERIFY YOUR PAYMENT";
    //           break;
    //         case PaymentStatus.CLOSED_DEAL:
    //           msg = "ORDER CLOSED. THANK YOU FOR TRANSACTING WITH US!";
    //           break;
    //       }

    //     }
    //   } else if (accountType == AccountType.SELLER) {
    //     if (page == Pages.BREAKDOWN) {
    //       switch (status) {
    //         case PaymentStatus.FOR_REVIEW:
    //           msg = "PLEASE WAIT WHILE WE CONFIRM BUYER'S ORDER.";
    //           break;
    //         case PaymentStatus.SELLER_PAYMENT:
    //           msg = "PLEASE PAY THE AMOUNT TO DEALOGIKAL'S BANK ACCOUNT";
    //           break;
    //         case PaymentStatus.SELLER_PAYMENT_VERIFICATION:
    //           msg = "PLEASE WAIT WHILE WE VERIFY YOUR PAYMENT";
    //           break;
    //         case PaymentStatus.FOR_DELIVERY:
    //           msg = "PLEASE PROCESS THE ORDER FOR DELIVERY.";
    //           break;
    //         case PaymentStatus.IN_TRANSIT:
    //           msg = "GREAT! PLEASE DELIVER THE ORDER ON THE REQUESTED LOCATION.";
    //           break;
    //         case PaymentStatus.PRODUCT_DELIVERED:
    //         case PaymentStatus.FOR_BUYER_PAYMENT:
    //         case PaymentStatus.BUYER_PAYMENT_VERIFICATION:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED. PLEASE PROCEED TO PAYMENT TAB.";
    //           break;
    //         case PaymentStatus.CLOSED_DEAL:
    //           msg = "THANK YOU FOR TRANSACTING WITH US!";
    //           break;
    //       }
    //     } else if (page == Pages.PAYMENT || page == Pages.SHIPPING) {
    //       switch (status) {
    //         case PaymentStatus.FOR_REVIEW:
    //           msg = "PLEASE WAIT WHILE WE CONFIRM BUYER'S ORDER.";
    //           break;
    //         case PaymentStatus.SELLER_PAYMENT:
    //         case 'Paid':
    //           msg = "PLEASE PAY THE AMOUNT TO DEALOGIKAL'S BANK ACCOUNT";
    //           break;
    //         case PaymentStatus.SELLER_PAYMENT_VERIFICATION:
    //           msg = "PLEASE WAIT WHILE WE VERIFY YOUR PAYMENT";
    //           break;
    //         case PaymentStatus.FOR_DELIVERY:
    //           msg = "PLEASE PROCESS THE ORDER FOR DELIVERY.";
    //           break;
    //         case PaymentStatus.IN_TRANSIT:
    //           msg = "GREAT! PLEASE DELIVER THE ORDER ON THE REQUESTED LOCATION.";
    //           break;
    //         case PaymentStatus.PRODUCT_DELIVERED:
    //         case PaymentStatus.FOR_BUYER_PAYMENT:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED. WAITING FOR BUYER'S PAYMENT.";
    //           break;
    //         case PaymentStatus.BUYER_PAYMENT_VERIFICATION:
    //           msg = "PAYMENT HAS BEEN MADE. PLEAE CHECK THE UPLOADED PAYMENT SLIP AND CONFIRM.";
    //           break;
    //         case PaymentStatus.CLOSED_DEAL:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY CLOSED.";
    //           break;
    //       }

    //     }
    //   } else if (accountType == AccountType.MARKET_MAKER) {
    //     if (page == Pages.BREAKDOWN) {
    //       // switch (status) {          
    //       // }
    //     } else if (page == Pages.PAYMENT || page == Pages.SHIPPING) {
    //       switch (status) {
    //         case PaymentStatus.FOR_BUYER_PAYMENT:
    //           msg = "WAITING FOR BUYER'S PAYMENT.";
    //           break;
    //         case PaymentStatus.SELLER_PAYMENT:
    //           msg = "WAITING FOR SELLER'S PAYMENT";
    //           break;
    //         case PaymentStatus.SELLER_PAYMENT_VERIFICATION:
    //           msg = "PAYMENT HAS BEEN MADE. PLEAE CHECK THE UPLOADED PAYMENT SLIP AND CONFIRM.";
    //           break;
    //         case PaymentStatus.BUYER_PAYMENT_VERIFICATION:
    //           msg = "PLEASE COMMUNICATE WITH THE SELLER. CHECK THE UPLOADED PAYMENT SLIP AND CONFIRM.";
    //           break;
    //         case PaymentStatus.FOR_DELIVERY:
    //           msg = "ORDER IS NOW READY FOR DELIVERY.";
    //           break;
    //         case PaymentStatus.IN_TRANSIT:
    //           msg = "ORDER IS NOW IN TRANSIT.";
    //           break;
    //         case PaymentStatus.PRODUCT_DELIVERED:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY DELIVERED. WAITING FOR BUYER'S CONFIRMATION.";
    //           break;
    //         case PaymentStatus.CLOSED_DEAL:
    //           msg = "ORDER HAS BEEN SUCCESSFULLY CLOSED.";
    //           break;
    //       }

    //     }
    //   }

    // }


    // return msg;

  }

  constructor(
    private user: UserService
  ) { }
}
