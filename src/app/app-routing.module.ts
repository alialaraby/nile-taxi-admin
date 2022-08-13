import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './views/admin/admin.component';
import { BoatComponent } from './views/boat/boat.component';
import { FuelRequestComponent } from './views/fuel-request/fuel-request.component';
import { PassengerComponent } from './views/passenger/passenger.component';
import { PilotComponent } from './views/pilot/pilot.component';
import { StationComponent } from './views/station/station.component';
import { DailyTripComponent } from './views/trip/daily-trip/daily-trip.component';
import { PrivateTripComponent } from './views/trip/private-trip/private-trip.component';
import { TourCategoryComponent } from './views/trip/tour-category/tour-category.component';


const routes: Routes = [
  { path: '', redirectTo: '/user-pages/login', pathMatch: 'full' },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'pilot', component: PilotComponent },
  { path: 'boat', component: BoatComponent },
  { path: 'station', component: StationComponent },
  { path: 'fuel-request', component: FuelRequestComponent },
  { path: 'tour-category', component: TourCategoryComponent },
  { path: 'daily-trip', component: DailyTripComponent },
  { path: 'private-trip', component: PrivateTripComponent },
  { path: 'passenger', component: PassengerComponent },
  // { path: 'basic-ui', loadChildren: () => import('./basic-ui/basic-ui.module').then(m => m.BasicUiModule) },
  // { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsDemoModule) },
  // { path: 'forms', loadChildren: () => import('./forms/form.module').then(m => m.FormModule) },
  // { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  // { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
  // { path: 'general-pages', loadChildren: () => import('./general-pages/general-pages.module').then(m => m.GeneralPagesModule) },
  // { path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule) },
  { path: 'user-pages', loadChildren: () => import('./user-pages/user-pages.module').then(m => m.UserPagesModule) },
  // { path: 'error-pages', loadChildren: () => import('./error-pages/error-pages.module').then(m => m.ErrorPagesModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
