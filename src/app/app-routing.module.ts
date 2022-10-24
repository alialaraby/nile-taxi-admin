import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './views/admin/admin.component';
import { BoatComponent } from './views/boats-pilots/boat/boat.component';
import { ComplainComponent } from './views/complain/complain.component';
import { CorporateAccountComponent } from './views/corporate-account/corporate-account.component';
import { CorporateMemberComponent } from './views/corporate-account/corporate-member/corporate-member.component';
import { FuelRequestComponent } from './views/boats-pilots/fuel-request/fuel-request.component';
import { PackageComponent } from './views/package/package.component';
import { PassengerComponent } from './views/passenger/passenger.component';
import { StudentAccountComponent } from './views/passenger/student-account/student-account.component';
import { PilotComponent } from './views/boats-pilots/pilot/pilot.component';
import { PromocodeComponent } from './views/promocode/promocode.component';
import { StationComponent } from './views/boats-pilots/station/station.component';
import { DailyTripComponent } from './views/trip/daily-trip/daily-trip.component';
import { PrivateTripComponent } from './views/trip/private-trip/private-trip.component';
import { TourCategoryComponent } from './views/trip/tour-category/tour-category.component';
import { EmergencyComponent } from './views/boats-pilots/emergency/emergency.component';
import { AuthGuard } from './core/service/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/user-pages/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'corporate-account', component: CorporateAccountComponent },
  { path: 'corporate-member/:_id', component: CorporateMemberComponent },
  
  { path: 'pilot', component: PilotComponent, canActivate: [AuthGuard] },
  { path: 'boat', component: BoatComponent, canActivate: [AuthGuard] },
  { path: 'station', component: StationComponent, canActivate: [AuthGuard] },
  { path: 'fuel-request', component: FuelRequestComponent, canActivate: [AuthGuard] },
  { path: 'emergency', component: EmergencyComponent, canActivate: [AuthGuard] },
  
  { path: 'tour-category', component: TourCategoryComponent, canActivate: [AuthGuard] },
  { path: 'daily-trip', component: DailyTripComponent, canActivate: [AuthGuard] },
  { path: 'private-trip', component: PrivateTripComponent, canActivate: [AuthGuard] },
  
  { path: 'passenger', component: PassengerComponent, canActivate: [AuthGuard] },
  { path: 'student-request', component: StudentAccountComponent, canActivate: [AuthGuard] },
  { path: 'complaint', component: ComplainComponent, canActivate: [AuthGuard] },
  
  { path: 'promocode', component: PromocodeComponent, canActivate: [AuthGuard] },
  { path: 'package', component: PackageComponent, canActivate: [AuthGuard] },
  { path: 'user-pages', loadChildren: () => import('./user-pages/user-pages.module').then(m => m.UserPagesModule) },
  
  { path: 'error-pages', loadChildren: () => import('./error-pages/error-pages.module').then(m => m.ErrorPagesModule) },
  { path: '**', redirectTo: '/error-pages/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
