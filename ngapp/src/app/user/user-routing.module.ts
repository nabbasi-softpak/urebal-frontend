import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './login/login.component';

import {TermsComponent} from './terms/terms.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {LoginGuardService} from "../services/login-guard.service";


const routes: Routes = [
    {path: 'user/login', component: LoginComponent, canActivate: [LoginGuardService]},
    {path: 'terms', component: TermsComponent},
    {path: '404', component: NotFoundPageComponent},
    {path: 'user/forbiddenaccess', component: NotFoundPageComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
