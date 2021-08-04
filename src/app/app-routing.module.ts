import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyerGuard } from './pages/buyer-page/buyer.guard';
import { BuyerPageComponent } from './pages/buyer-page/buyer-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SellerPageComponent } from './pages/seller-page/seller-page.component';
import { SellerGuard } from './pages/seller-page/seller.guard';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { NewOrderPageComponent } from './pages/new-order-page/new-order-page.component';
import { CommoditySelectorComponent } from './pages/new-order-page/commodity-selector/commodity-selector.component';
import { TemplatesPageComponent } from './pages/new-order-page/templates-page/templates-page.component';
import { SaveAsTemplateComponent } from './pages/new-order-page/save-as-template/save-as-template.component';
import { OrderFormComponent } from './pages/new-order-page/order-form/order-form.component';
import { FormProductComponent } from './pages/new-order-page/order-form/forms/form-product/form-product.component';
import { FormShippingComponent } from './pages/new-order-page/order-form/forms/form-shipping/form-shipping.component';
import { ScheduleSelectComponent } from './pages/new-order-page/order-form/forms/form-shipping/schedule-select/schedule-select.component';
import { FormDetailsComponent } from './pages/new-order-page/order-form/forms/form-details/form-details.component';
import { ParticipantsSelectorComponent } from './pages/new-order-page/order-form/forms/form-participants/selector/selector.component';
import { FormParticipantsComponent } from './pages/new-order-page/order-form/forms/form-participants/form-participants.component';
import { BuyerOrderPageComponent } from './pages/order-page/buyer/order-page.component';
import { BuyerAuctionPageComponent } from './pages/order-page/buyer/tabs/auction-page/auction-page.component';
import { BuyerBreakdownPageComponent } from './pages/order-page/buyer/tabs/breakdown-page/breakdown-page.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { BuyerPaymentPageComponent } from './pages/order-page/buyer/tabs/payment-page/payment-page.component';
import { BuyerShippingPageComponent } from './pages/order-page/buyer/tabs/shipping-page/shipping-page.component';
import { BuyerClosedPageComponent } from './pages/order-page/buyer/tabs/closed-page/closed-page.component';
import { FormOrderFilterComponent } from './pages/orders-page/form-order-filter/form-order-filter.component';
import { TestPageComponent } from './pages/test-page/test-page.component';
import { OffersPageComponent } from './pages/offers-page/offers-page.component';
import { AuctionPageComponent } from './pages/auction-page/auction-page.component';
import { SellerAuctionPageComponent } from './pages/order-page/seller/tabs/auction-page/auction-page.component';
import { SellerPaymentPageComponent } from './pages/order-page/seller/tabs/payment-page/payment-page.component';
import { SellerShippingPageComponent } from './pages/order-page/seller/tabs/shipping-page/shipping-page.component';
import { SellerClosedPageComponent } from './pages/order-page/seller/tabs/closed-page/closed-page.component';
import { SellerOrderPageComponent } from './pages/order-page/seller/order-page.component';
import { OfferPageComponent } from './pages/order-page/partials/offer-page/offer-page.component';

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "login",
  },
  {
    path: "test",
    component: TestPageComponent,
  },
  {
    path: "login",
    component: LoginPageComponent,
  },
  {
    path: 'home',
    component: HomePageComponent,
    children: [
      {
        path: 'b',
        component: BuyerPageComponent,
        canActivate: [BuyerGuard],
        children: [
          {
            path: "",
            pathMatch: "full",
            redirectTo: "my-orders",
          },
          {
            path: "my-orders",
            component: OrdersPageComponent,
            children: [
              {
                path: "filter",
                component: FormOrderFilterComponent,
              }
            ]
          },
          {
            path: 'order/:_id',
            component: BuyerOrderPageComponent,
            children: [
              {
                path: "auction",
                component: BuyerAuctionPageComponent,
              },
              {
                path: "auction/:product_id",
                component: BuyerAuctionPageComponent,
              },
              {
                path: "breakdown",
                component: BuyerBreakdownPageComponent,
              },
              {
                path: "payment",
                component: BuyerPaymentPageComponent,
              },
              {
                path: "shipping",
                component: BuyerShippingPageComponent,
              },
              {
                path: "closed",
                component: BuyerClosedPageComponent,
              },
            ]
          },
          {
            path: 'new-order',
            component: NewOrderPageComponent,
            children: [
              {
                path: 'commodity',
                component: CommoditySelectorComponent
              },
              {
                path: 'templates',
                component: TemplatesPageComponent,
              },
              {
                path: 'save',
                component: SaveAsTemplateComponent,
              },
              {
                path: 'form',
                component: OrderFormComponent,
                children: [
                  {
                    path: "",
                    pathMatch: "full",
                    redirectTo: "product",
                  },
                  {
                    path: 'product',
                    component: FormProductComponent,
                  },
                  {
                    path: 'shipping',
                    component: FormShippingComponent,
                    children: [
                      {
                        path: 'schedule',
                        component: ScheduleSelectComponent,
                      },
                      {
                        path: 'schedule/:schedule_id',
                        component: ScheduleSelectComponent,
                      },
                    ]
                  },
                  {
                    path: 'details',
                    component: FormDetailsComponent,
                  },
                  {
                    path: 'participants',
                    component: FormParticipantsComponent,
                    children: [
                      {
                        path: 'select',
                        component: ParticipantsSelectorComponent,
                      },
                    ]
                  }
                ]
              },
              {
                path: 'form/:item_id',
                component: OrderFormComponent,
                children: [
                  {
                    path: "",
                    pathMatch: "full",
                    redirectTo: "product",
                  },
                  {
                    path: 'product',
                    component: FormProductComponent,
                  },
                  {
                    path: 'shipping',
                    component: FormShippingComponent,
                    children: [
                      {
                        path: 'schedule',
                        component: ScheduleSelectComponent,
                      },
                      {
                        path: 'schedule/:schedule_id',
                        component: ScheduleSelectComponent,
                      },
                    ]
                  },
                  {
                    path: 'details',
                    component: FormDetailsComponent,
                  },
                  {
                    path: 'participants',
                    component: FormParticipantsComponent,
                    children: [
                      {
                        path: 'select',
                        component: ParticipantsSelectorComponent,
                      },
                    ]
                  }
                ]
              }
            ]
          },
          {
            path: 'new-order/:template_id',
            component: NewOrderPageComponent,
            children: [
              {
                path: 'commodity',
                component: CommoditySelectorComponent
              },
              {
                path: 'templates',
                component: TemplatesPageComponent,
              },
              {
                path: 'save',
                component: SaveAsTemplateComponent,
              }, {
                path: 'form',
                component: OrderFormComponent,
                children: [
                  {
                    path: "",
                    pathMatch: "full",
                    redirectTo: "product",
                  },
                  {
                    path: 'product',
                    component: FormProductComponent,
                  },
                  {
                    path: 'shipping',
                    component: FormShippingComponent,
                    children: [
                      {
                        path: 'schedule',
                        component: ScheduleSelectComponent,
                      },
                      {
                        path: 'schedule/:schedule_id',
                        component: ScheduleSelectComponent,
                      },
                    ]
                  },
                  {
                    path: 'details',
                    component: FormDetailsComponent,
                  },
                  {
                    path: 'participants',
                    component: FormParticipantsComponent,
                    children: [
                      {
                        path: 'select',
                        component: ParticipantsSelectorComponent,
                      },
                    ]
                  }
                ]
              },
              {
                path: 'form/:item_id',
                component: OrderFormComponent,
                children: [
                  {
                    path: "",
                    pathMatch: "full",
                    redirectTo: "product",
                  },
                  {
                    path: 'product',
                    component: FormProductComponent,
                  },
                  {
                    path: 'shipping',
                    component: FormShippingComponent,
                    children: [
                      {
                        path: 'schedule',
                        component: ScheduleSelectComponent,
                      },
                      {
                        path: 'schedule/:schedule_id',
                        component: ScheduleSelectComponent,
                      },
                    ]
                  },
                  {
                    path: 'details',
                    component: FormDetailsComponent,
                  },
                  {
                    path: 'participants',
                    component: FormParticipantsComponent,
                    children: [
                      {
                        path: 'select',
                        component: ParticipantsSelectorComponent,
                      },
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: 's',
        component: SellerPageComponent,
        canActivate: [SellerGuard],
        children: [
          {
            path: "",
            pathMatch: "full",
            redirectTo: "open-for-auction",
          },
          {
            path: "open-for-auction",
            component: AuctionPageComponent,
          },
          {
            path: "my-offers",
            component: OffersPageComponent,
            // children: [
            //   {
            //     path: "filter",
            //     component: FormOrderFilterComponent,
            //   }
            // ]
          },
          {
            path: 'order/:_id',
            component: SellerOrderPageComponent,
            children: [
              {
                path: "auction",
                component: SellerAuctionPageComponent,
              },
              {
                path: "auction/:product_id",
                component: SellerAuctionPageComponent,
                children: [
                  {
                    path: 'offer',
                    component: OfferPageComponent
                  }
                ]
              },
              {
                path: "payment",
                component: SellerPaymentPageComponent,
              },
              {
                path: "shipping",
                component: SellerShippingPageComponent,
              },
              {
                path: "closed",
                component: SellerClosedPageComponent,
              },
            ]
          },
        ]
      }
    ]
  },
  {
    path: "error/:errorNum",
    component: ErrorPageComponent,
  },
  {
    path: "**",
    redirectTo: "/error/404",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
