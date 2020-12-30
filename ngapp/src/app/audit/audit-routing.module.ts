import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuditDetailComponent} from "./audit-detail/audit-detail.component";
import {AuditTrailComponent} from "./audit-trail/audit-trail.component";


const routes: Routes = [
  {
    path: 'list', component: AuditTrailComponent,
    data:
      {
        permissionName: 'equivalenceList',
        checkSessionValidation: false
      }
  },
  {
    path: 'audit/:trailId', component: AuditDetailComponent,
    data:
      {
        permissionName: 'equivalenceModify',
        checkSessionValidation: false
      }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditRoutingModule { }
