import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DataImportAccountComponent} from './data-import-account/data-import-account.component'
import {DataImportComponent} from "./data-imports/data-import.component";
import {DataImportSupportComponent} from "./data-import-support/data-import-support.component";
import {AuthGuardService} from "../services/auth-guard.service";

const routes: Routes = [
    {path: '', component: DataImportComponent},
    {
        path: 'data-import-support', component: DataImportSupportComponent,
        data: {
            permissionName: 'supportZipImport'
        },
        canActivate: [AuthGuardService]
    },
    {
        path: 'data-import', component: DataImportAccountComponent,
        data: {
            permissionName: 'accountImport'
        },
        canActivate: [AuthGuardService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DataImportAccountRoutingModule {
}
