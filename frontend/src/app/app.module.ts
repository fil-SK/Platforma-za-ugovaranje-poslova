import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {HttpClientModule} from '@angular/common/http';
import { ClientComponent } from './client/client.component';
import { AgencyComponent } from './agency/agency.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { RealEstateComponent } from './real-estate/real-estate.component';
import { SimpleRealEstateDetailsComponent } from './simple-real-estate-details/simple-real-estate-details.component';
import { FullRealEstateDetailsComponent } from './full-real-estate-details/full-real-estate-details.component';
import { AllAgenciesPageComponent } from './all-agencies-page/all-agencies-page.component';
import { SimpleAgencyDetailsComponent } from './simple-agency-details/simple-agency-details.component';
import { FullAgencyDetailsAndRequestComponent } from './full-agency-details-and-request/full-agency-details-and-request.component';
import { BusinessComponent } from './business/business.component';
import { SimpleBusinessDetailsComponent } from './simple-business-details/simple-business-details.component';
import { FullRequestPageComponent } from './full-request-page/full-request-page.component';
import { AgencyRequestSimpleComponent } from './agency-request-simple/agency-request-simple.component';
import { AgencyRequestFullComponent } from './agency-request-full/agency-request-full.component';
import { FooterComponent } from './footer/footer.component';
import { AdminViewsClientComponent } from './admin-views-client/admin-views-client.component';
import { AdminViewsAgencyComponent } from './admin-views-agency/admin-views-agency.component';
import { AdminDoingRegistrationComponent } from './admin-doing-registration/admin-doing-registration.component';
import { WorkerDetailsComponent } from './worker-details/worker-details.component';
import { AdminViewsJobsComponent } from './admin-views-jobs/admin-views-jobs.component';
import { AuthService } from './services/auth.service';
import { WorkersComponent } from './workers/workers.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginComponent,
    RegisterComponent,
    ClientComponent,
    AgencyComponent,
    AdminComponent,
    AdminLoginComponent,
    NavbarComponent,
    LogoutComponent,
    ProfileComponent,
    RealEstateComponent,
    SimpleRealEstateDetailsComponent,
    FullRealEstateDetailsComponent,
    AllAgenciesPageComponent,
    SimpleAgencyDetailsComponent,
    FullAgencyDetailsAndRequestComponent,
    BusinessComponent,
    SimpleBusinessDetailsComponent,
    FullRequestPageComponent,
    AgencyRequestSimpleComponent,
    AgencyRequestFullComponent,
    FooterComponent,
    AdminViewsClientComponent,
    AdminViewsAgencyComponent,
    AdminDoingRegistrationComponent,
    WorkerDetailsComponent,
    AdminViewsJobsComponent,
    WorkersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
