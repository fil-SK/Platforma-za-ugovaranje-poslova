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
  {path: "realEstateDetails", component: FullRealEstateDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
