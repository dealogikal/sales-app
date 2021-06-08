import { NgModule } from '@angular/core';
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


const PAGES: any = [
  ErrorPageComponent,
  LoginPageComponent,
  HomePageComponent,
  BuyerPageComponent,
  SellerPageComponent,
  NewOrderPageComponent,
  TemplatesPageComponent,
  OrderFormComponent,
];

const LAYOUT: any = [
  SidebarComponent,
  HeaderComponent,
]

@NgModule({
  declarations: [
    AppComponent,
    ...PAGES,
    ...LAYOUT,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIziToastModule,
    FeatherModule.pick(ICONS),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
