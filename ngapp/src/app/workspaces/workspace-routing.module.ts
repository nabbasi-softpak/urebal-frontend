import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkspaceComponent } from './workspace-list/workspace.component';
import { CreateWorkspaceComponent } from './create-workspace/create-workspace.component';
import { EditWorkspaceComponent } from './edit-workspace/edit-workspace.component';
import { ExecuteWorkspaceComponent } from './execute-workspace/execute-workspace.component';
import { WorkspaceReportsComponent } from './workspace-reports/workspace-reports.component';
import { TradeOverrideComponent } from "./tradeoverride/tradeoverride.component";
import {AuthGuardService} from "../services/auth-guard.service";

const routes: Routes = [
  {
    path: 'list', component: WorkspaceComponent,
    data:
      {
        permissionName: 'workspaceList',
        checkSessionValidation: false
      }
  },
  {
    path: 'rebalance/:wsName', component: CreateWorkspaceComponent,
    data:
      {
        permissionName: 'workspaceModify',
        checkSessionValidation: false
      }
  },
  {
    path: 'rebalance', component: CreateWorkspaceComponent,
    data:
      {
        permissionName: 'workspaceCreate',
        checkSessionValidation: false
      }
  },
  {
    path: 'executeRebalance', component: ExecuteWorkspaceComponent,
    data:
      {
        permissionName: 'workspaceView',
        checkSessionValidation: false
      }, canActivate: [AuthGuardService]
  },
  {
    path: 'executeRebalance/:wsName', component: ExecuteWorkspaceComponent,
    data:
      {
        permissionName: 'workspaceView',
        checkSessionValidation: false
      }, canActivate: [AuthGuardService]
  },
  {
    path: 'viewreports/:workspace_name', component: WorkspaceReportsComponent,
    data:
      {
        permissionName: 'portfolioViewReports',
        checkSessionValidation: false
      }
  },
  { path: 'tradeOverride', component: TradeOverrideComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }
