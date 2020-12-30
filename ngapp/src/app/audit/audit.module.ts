import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditDetailComponent } from './audit-detail/audit-detail.component';

import {SharedModule} from "../shared/shared.module";
import {AuditRoutingModule} from "./audit-routing.module";
import {AuditService} from "./audit.service";
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [AuditDetailComponent,  AuditTrailComponent],
    imports: [
        CommonModule, SharedModule, AuditRoutingModule, FormsModule
    ],
  providers:[
    AuditService
  ]
})
export class AuditModule { }
