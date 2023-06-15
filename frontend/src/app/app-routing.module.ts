import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminComponent } from './admin/admin.component';
import { AgencyComponent } from './agency/agency.component';
import { ClientComponent } from './client/client.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { RealEstateComponent } from './real-estate/real-estate.component';
import { RegisterComponent } from './register/register.component';
import { FullRealEstateDetailsComponent } from './full-real-estate-details/full-real-estate-details.component';
import { AllAgenciesPageComponent } from './all-agencies-page/all-agencies-page.component';
import { FullAgencyDetailsAndRequestComponent } from './full-agency-details-and-request/full-agency-details-and-request.component';
import { BusinessComponent } from './business/business.component';
import { FullRequestPageComponent } from './full-request-page/full-request-page.component';
import { AgencyRequestFullComponent } from './agency-request-full/agency-request-full.component';
import { AdminViewsClientComponent } from './admin-views-client/admin-views-client.component';
import { AdminViewsAgencyComponent } from './admin-views-agency/admin-views-agency.component';
import { WorkerDetailsComponent } from './worker-details/worker-details.component';
import { AdminViewsJobsComponent } from './admin-views-jobs/admin-views-jobs.component';

const routes: Routes = [
  {path : "", component : HomePageComponent},
  {path: "adminLogin", component : AdminLoginComponent},
  {path : "login", component : LoginComponent},
  {path : "register", component : RegisterComponent},
  {path : "logout", component : LogoutComponent},

  {path : "client", component : ClientComponent},
  {path : "agency", component : AgencyComponent},
  {path : "admin", component : AdminComponent},

  {path : "profile", component : ProfileComponent},
  {path: "realEstate", component : RealEstateComponent},
  {path: "realEstateDetails", component: FullRealEstateDetailsComponent},

  {path: "allAgenciesPage", component : AllAgenciesPageComponent},
  {path: "agencyDetailsAndRequest", component : FullAgencyDetailsAndRequestComponent},

  {path: "business", component : BusinessComponent},
  {path: "fullRequestPage", component : FullRequestPageComponent},
  {path : "agencyFullRequest", component : AgencyRequestFullComponent},

  {path: "adminViewsClientDetails", component : AdminViewsClientComponent},
  {path: "adminViewsAgencyDetails", component : AdminViewsAgencyComponent},
  {path: "workerDetailsPage", component : WorkerDetailsComponent},
  {path: "adminViewsJobDetails", component: AdminViewsJobsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
