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

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "login",
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
            ]
          }
        ]
      },
      {
        path: 's',
        component: SellerPageComponent,
        canActivate: [SellerGuard]
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
