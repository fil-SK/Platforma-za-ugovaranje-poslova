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
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path : "", component : HomePageComponent},
  {path: "adminLogin", component : AdminLoginComponent},
  {path : "login", component : LoginComponent},
  {path : "register", component : RegisterComponent},
  {path : "logout", component : LogoutComponent},

  {path : "client", component : ClientComponent},
  {path : "agency", component : AgencyComponent},
  {path : "admin", component : AdminComponent},

  {path : "profile", component : ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
