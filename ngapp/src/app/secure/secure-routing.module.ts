import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SecureComponent} from './secure.component';
import {HistoryComponent} from "../history/history.component";
import {ChangePasswordComponent} from '../user/change-password/change-password.component';
import {AuthGuardService} from "../services/auth-guard.service";

const routes: Routes = [
    {
        path: '', component: SecureComponent,
        children: [
            {path: '', redirectTo: '/secure/dashboard', pathMatch: "full"},
            {path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)},
            {path: 'accounts', loadChildren: () => import('../account/account.module').then(m => m.AccountModule)},
            {path: 'drift', loadChildren: () => import('../drifts/drift.module').then(m => m.DriftModule)},
            {path: 'rebalances', loadChildren: () => import('../workspaces/workspace.module').then(m => m.WorkspaceModule)},
            {path: 'templates', loadChildren: () => import('../templates/templates.module').then(m => m.TemplatesModule)},
            {path: 'model', loadChildren: () => import('../model/model.module').then(m => m.ModelModule)},
            {path: 'attributes', loadChildren: () => import('../attributes/attribute.module').then(m => m.AttributeModule)},
            {
                path: 'reports', loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule),
                data:
                    {
                        permissionName: 'reportInsights',
                    }, canActivate: [AuthGuardService]
            },
            {path: 'equivalences', loadChildren: () => import('../equivalences/equivalance.module').then(m => m.EquivalanceModule)},
            {path: 'audit', loadChildren: () => import('../audit/audit.module').then(m => m.AuditModule)},
            {path: 'security', loadChildren: () => import('../security/security.module').then(m => m.SecurityModule)},

            {
                path: 'imports', loadChildren: () => import('../settings/data-import-account.module').then(m => m.DataImportAccountModule),
                data:
                    {
                        permissionName: 'importData',
                    }, canActivate: [AuthGuardService]
            },
            {path: 'history', component: HistoryComponent},

            {path: 'user/changepassword', component: ChangePasswordComponent},
        ]
    },
    {path: '**', redirectTo: '404'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SecureRoutingModule {
}
