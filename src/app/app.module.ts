import { NgModule } from '@angular/core'; 
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxIziToastModule } from 'ngx-izitoast';

import { FeatherModule } from "angular-feather";
import {
  Plus,
  Trash,
  ChevronRight,
  Clock,
  DollarSign,
  X,
  ArrowDown,
  ArrowUp,
  Tag,
  Truck,
  Package,
  Check,
  Eye,
  ShoppingCart,
  Upload,
  File,
  Link,
  Link2,
  ArrowLeft,
  ArrowLeftCircle,
  Search,
  ChevronDown,
  CreditCard,
  Briefcase,
  Calendar,
  Menu,
  LogOut,
  Settings,
  List,
  DownloadCloud,
  BarChart2,
  Trello,
  Users,
  Edit,
  Paperclip,
  Save,
  Info,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  Copy,
  UserMinus,
  Zap,
  Smartphone,
  MapPin
} from "angular-feather/icons";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { BuyerPageComponent } from './pages/buyer-page/buyer-page.component';
import { SellerPageComponent } from './pages/seller-page/seller-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { HeaderComponent } from './layouts/header/header.component';
import { NewOrderPageComponent } from './pages/new-order-page/new-order-page.component';
import { TemplatesPageComponent } from './pages/new-order-page/templates-page/templates-page.component';
import { OrderFormComponent } from './pages/new-order-page/order-form/order-form.component';
import { FormAbstractFieldComponent } from './ui/forms/form-abstract-field/form-abstract-field.component';
import { FormSelectFieldComponent } from './ui/forms/form-select-field/form-select-field.component';
import { FormDateFieldComponent } from './ui/forms/form-date-field/form-date-field.component';
import { FormTimeFieldComponent } from './ui/forms/form-time-field/form-time-field.component';
import { FormNumberFieldComponent } from './ui/forms/form-number-field/form-number-field.component';
import { FormSwitchFieldComponent } from './ui/forms/form-switch-field/form-switch-field.component';
import { CommoditySelectorComponent } from './pages/new-order-page/commodity-selector/commodity-selector.component';
import { CardTemplateComponent } from './ui/cards/card-template/card-template.component';
import { CheckSelectedPipe, FloatPipe, IsBeforeToday, NextShippingStatusPipe, NoComma, ObjectKeys, ProcessingFeePipe } from './helpers/pipes/pipe';
import { SaveAsTemplateComponent } from './pages/new-order-page/save-as-template/save-as-template.component';
import { FormProductComponent } from './pages/new-order-page/order-form/forms/form-product/form-product.component';
import { FormShippingComponent } from './pages/new-order-page/order-form/forms/form-shipping/form-shipping.component';
import { FormDetailsComponent } from './pages/new-order-page/order-form/forms/form-details/form-details.component';
import { FormParticipantsComponent } from './pages/new-order-page/order-form/forms/form-participants/form-participants.component';
import { ScheduleSelectComponent } from './pages/new-order-page/order-form/forms/form-shipping/schedule-select/schedule-select.component';
import { ParticipantsSelectorComponent } from './pages/new-order-page/order-form/forms/form-participants/selector/selector.component';
import { FormTextareaFieldComponent } from './ui/forms/form-textarea-field/form-textarea-field.component';
import { BuyerOrderPageComponent } from './pages/order-page/buyer/order-page.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { BuyerAuctionPageComponent } from './pages/order-page/buyer/tabs/auction-page/auction-page.component';
import { StatusTagComponent } from './ui/etc/status-tag/status-tag.component';
import { CardOfferComponent } from './ui/cards/card-offer/card-offer.component';
import { DateAgoComponent } from './ui/etc/date-ago/date-ago.component';
import { CheckoutDrawerComponent } from './layouts/checkout-drawer/checkout-drawer.component';

import { BuyerBreakdownPageComponent } from './pages/order-page/buyer/tabs/breakdown-page/breakdown-page.component';
import { CardOrderComponent } from './ui/cards/card-order/card-order.component';
import { BuyerPaymentPageComponent } from './pages/order-page/buyer/tabs/payment-page/payment-page.component';
import { BuyerShippingPageComponent } from './pages/order-page/buyer/tabs/shipping-page/shipping-page.component';
import { BuyerClosedPageComponent } from './pages/order-page/buyer/tabs/closed-page/closed-page.component';
import { FormAttachmentsFieldComponent } from './ui/forms/form-attachments-field/form-attachments-field.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FormUploaderFieldComponent } from './ui/forms/form-uploader-field/form-uploader-field.component';
import { BankDepositComponent } from './pages/order-page/partials/bank-deposit/bank-deposit.component';
import { FormOrderFilterComponent } from './pages/orders-page/form-order-filter/form-order-filter.component';
import { FormChipsFieldComponent } from './ui/forms/form-chips-field/form-chips-field.component';
import { TestPageComponent } from './pages/test-page/test-page.component';
import { OffersPageComponent } from './pages/offers-page/offers-page.component';
import { AuctionPageComponent } from './pages/auction-page/auction-page.component';
import { SellerOrderPageComponent } from './pages/order-page/seller/order-page.component';
import { SellerAuctionPageComponent } from './pages/order-page/seller/tabs/auction-page/auction-page.component';
import { SellerPaymentPageComponent } from './pages/order-page/seller/tabs/payment-page/payment-page.component';
import { SellerShippingPageComponent } from './pages/order-page/seller/tabs/shipping-page/shipping-page.component';
import { SellerClosedPageComponent } from './pages/order-page/seller/tabs/closed-page/closed-page.component';
import { OfferPageComponent } from './pages/order-page/partials/offer-page/offer-page.component';


const ICONS = {
  Plus,
  Trash,
  ChevronRight,
  ChevronDown,
  Clock,
  DollarSign,
  X,
  ArrowDown,
  ArrowUp,
  Tag,
  Truck,
  Package,
  Check,
  Eye,
  ShoppingCart,
  Upload,
  Link,
  Link2,
  File,
  ArrowLeft,
  ArrowLeftCircle,
  Search,
  CreditCard,
  Briefcase,
  Menu,
  LogOut,
  Settings,
  List,
  DownloadCloud,
  BarChart2,
  Trello,
  Users,
  Edit,
  Paperclip,
  Save,
  Info,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  Copy,
  UserMinus,
  Zap,
  Smartphone,
  Calendar,
  MapPin
};


const LAYOUT: any = [
  SidebarComponent,
  HeaderComponent,
  CheckoutDrawerComponent,
]

const FORM_UI: any = [
  FormAbstractFieldComponent,
  FormDateFieldComponent,
  FormNumberFieldComponent,
  FormSelectFieldComponent,
  FormSwitchFieldComponent,
  FormTimeFieldComponent,
  FormSwitchFieldComponent,
  FormTextareaFieldComponent,
  FormAttachmentsFieldComponent,
  FormUploaderFieldComponent,
  FormChipsFieldComponent
];

const NEW_ORDER_PAGE: any = [
  CommoditySelectorComponent,
  TemplatesPageComponent,
  SaveAsTemplateComponent,
  FormProductComponent,
  FormShippingComponent,
  FormDetailsComponent,
  FormParticipantsComponent,
  ScheduleSelectComponent,
  ParticipantsSelectorComponent,
  FormOrderFilterComponent
]

const ORDER_PAGE: any = [
  BuyerOrderPageComponent,
  BuyerAuctionPageComponent,
  BuyerBreakdownPageComponent,
  BuyerPaymentPageComponent,
  BuyerShippingPageComponent,
  BuyerClosedPageComponent,
  BankDepositComponent,
  SellerOrderPageComponent,
  SellerAuctionPageComponent,
  SellerPaymentPageComponent,
  SellerShippingPageComponent,
  SellerClosedPageComponent
]


const PAGES: any = [
  ErrorPageComponent,
  LoginPageComponent,
  HomePageComponent,
  BuyerPageComponent,
  SellerPageComponent,
  NewOrderPageComponent,
  OrderFormComponent,
  OrdersPageComponent,
  OffersPageComponent,
  AuctionPageComponent,
  OfferPageComponent,
  ...ORDER_PAGE,
];

const CARDS: any = [
  CardTemplateComponent,
  CardOfferComponent,
  CardOrderComponent
]

const UI: any = [
  DateAgoComponent,
  StatusTagComponent
]

const PIPES: any = [
  ObjectKeys,
  NoComma,
  FloatPipe,
  // TransactionInfoPipe,
  // TransactionCostPipe,
  ProcessingFeePipe,
  CheckSelectedPipe,
  NextShippingStatusPipe,
  // OfferCountPipe,
  IsBeforeToday,
  // DecimalPipe
];

@NgModule({
  declarations: [
    AppComponent,
    ...PAGES,
    ...FORM_UI,
    ...LAYOUT,
    ...NEW_ORDER_PAGE,
    ...CARDS,
    ...UI,
    ...PIPES,
    TestPageComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIziToastModule,
    FileUploadModule,
    FeatherModule.pick(ICONS),
  ],
  providers: [
    DecimalPipe,
    ...PIPES
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
