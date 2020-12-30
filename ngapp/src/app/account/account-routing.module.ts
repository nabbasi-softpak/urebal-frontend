import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AccountComponent} from './account-list/account.component';
import {CreateHouseHoldComponent} from './create-household/create-household.component';
import {AccountDetailComponent} from './account-detail/account-detail.component';
import {AuthGuardService} from "../services/auth-guard.service";

const routes: Routes = [
    {
        path: 'list', component: AccountComponent,
        data:
            {
                permissionName: 'portfolioList',
                checkSessionValidation: false
            }
    },
    {
        //path: 'accounts/:account/:household', component: AccountDetailComponent,
        path: ':portfolioId/:household', component: AccountDetailComponent,
        data:
            {
                permissionName: 'accountViewData',
                checkSessionValidation: false
            }, canActivate: [AuthGuardService]
    },
    {
        path: 'createHousehold', component: CreateHouseHoldComponent,
        data:
            {
                permissionName: 'portfolioCreateHousehold',
                checkSessionValidation: false
            }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [[RouterModule]]
})

export class AccountRoutingModule {
}
