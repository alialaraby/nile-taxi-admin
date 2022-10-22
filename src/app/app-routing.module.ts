import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './views/admin/admin.component';
import { BoatComponent } from './views/boat/boat.component';
import { ComplainComponent } from './views/complain/complain.component';
import { CorporateAccountComponent } from './views/corporate-account/corporate-account.component';
import { CorporateMemberComponent } from './views/corporate-account/corporate-member/corporate-member.component';
import { FuelRequestComponent } from './views/fuel-request/fuel-request.component';
import { PackageComponent } from './views/package/package.component';
import { PassengerComponent } from './views/passenger/passenger.component';
import { StudentAccountComponent } from './views/passenger/student-account/student-account.component';
import { PilotComponent } from './views/pilot/pilot.component';
import { PromocodeComponent } from './views/promocode/promocode.component';
import { StationComponent } from './views/station/station.component';
import { DailyTripComponent } from './views/trip/daily-trip/daily-trip.component';
import { PrivateTripComponent } from './views/trip/private-trip/private-trip.component';
import { TourCategoryComponent } from './views/trip/tour-category/tour-category.component';

const routes: Routes = [
  { path: '', redirectTo: '/user-pages/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'corporate-account', component: CorporateAccountComponent },
  { path: 'corporate-member/:_id', component: CorporateMemberComponent },
  { path: 'pilot', component: PilotComponent },
  { path: 'boat', component: BoatComponent },
  { path: 'station', component: StationComponent },
  { path: 'fuel-request', component: FuelRequestComponent },
  { path: 'tour-category', component: TourCategoryComponent },
  { path: 'daily-trip', component: DailyTripComponent },
  { path: 'private-trip', component: PrivateTripComponent },
  { path: 'passenger', component: PassengerComponent },
  { path: 'student-request', component: StudentAccountComponent },
  { path: 'promocode', component: PromocodeComponent },
  { path: 'complaint', component: ComplainComponent },
  { path: 'package', component: PackageComponent },
  { path: 'user-pages', loadChildren: () => import('./user-pages/user-pages.module').then(m => m.UserPagesModule) },
  { path: 'error-pages', loadChildren: () => import('./error-pages/error-pages.module').then(m => m.ErrorPagesModule) },
  { path: '**', redirectTo: '/error-pages/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
