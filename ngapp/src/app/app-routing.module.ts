import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import {CustomPreloadingStrategy} from "./shared/classes/CustomPreloadingStrategy.class";
import {RedirectComponent} from "./redirect/redirect.component";

const routes: Routes = [
  { path: '', redirectTo: '/user/login', pathMatch: 'full' },
  { path: 'secure', loadChildren: () => import('./secure/secure.module').then(m => m.SecureModule), canActivate: [AuthGuardService] },
  { path: 'redirect/:token', component: RedirectComponent},
  { path: 'redirect', component: RedirectComponent},  // NOTE: This path is used in webservice. (LoginWS.java)
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: CustomPreloadingStrategy})],
  exports: [RouterModule],
  providers: [CustomPreloadingStrategy]
})
export class AppRoutingModule { }
