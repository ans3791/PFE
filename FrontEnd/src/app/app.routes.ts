import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { TrackingComponent } from './pages/tracking/tracking.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AboutComponent } from './pages/about us/aboutus.component';
import { SearchComponent } from './pages/searchjob/search.component';
import { createAccountComponent } from './pages/create/createAccount.component';
import { AuthGuard } from './services/auth.guard';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { JobOffersComponent } from './pages/job-offers/job-offers.component';


export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tracking', component: TrackingComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'about-us', component: AboutComponent },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'create', component: createAccountComponent },
  { path: 'job-offers', component: JobOffersComponent, canActivate: [AuthGuard] },
  { path: 'applications', component: ApplicationsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
