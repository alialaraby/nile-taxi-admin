import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule, ThemeService } from 'ng2-charts';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ContentAnimateDirective } from './shared/directives/content-animate.directive';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminComponent } from './views/admin/admin.component';
import { PilotComponent } from './views/boats-pilots/pilot/pilot.component';
import { BoatComponent } from './views/boats-pilots/boat/boat.component';
import { PassengerComponent } from './views/passenger/passenger.component';
import { StationComponent } from './views/boats-pilots/station/station.component';
import { FuelRequestComponent } from './views/boats-pilots/fuel-request/fuel-request.component';
import { DailyTripComponent } from './views/trip/daily-trip/daily-trip.component';
import { PrivateTripComponent } from './views/trip/private-trip/private-trip.component';
import { EmptyListComponent } from './shared/empty-list/empty-list.component';
import { JWTInterceptor } from './core/interceptors/jwt-interceptor';
import { NgSelectModule } from '@ng-select/ng-select';
import { TourCategoryComponent } from './views/trip/tour-category/tour-category.component';
import { PromocodeComponent } from './views/promocode/promocode.component';
import { ComplainComponent } from './views/complain/complain.component';
import { PackageComponent } from './views/package/package.component';
import { CorporateAccountComponent } from './views/corporate-account/corporate-account.component';
import { CorporateMemberComponent } from './views/corporate-account/corporate-member/corporate-member.component';
import { StudentAccountComponent } from './views/passenger/student-account/student-account.component';
import { EmergencyComponent } from './views/boats-pilots/emergency/emergency.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    SpinnerComponent,
    ContentAnimateDirective,
    AdminComponent,
    PilotComponent,
    BoatComponent,
    PassengerComponent,
    StationComponent,
    FuelRequestComponent,
    DailyTripComponent,
    PrivateTripComponent,
    EmptyListComponent,
    TourCategoryComponent,
    PromocodeComponent,
    ComplainComponent,
    PackageComponent,
    CorporateAccountComponent,
    CorporateMemberComponent,
    StudentAccountComponent,
    EmergencyComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgSelectModule
  ],
  providers: [
    ThemeService,
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
