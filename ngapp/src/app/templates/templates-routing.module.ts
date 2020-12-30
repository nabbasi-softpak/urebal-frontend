import { NgModule } from '@angular/core';
import {RouterModule} from "@angular/router";
import { templateRoutes } from "./templates.routes";


@NgModule({
  imports: [
    RouterModule.forChild(templateRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TemplatesRoutingModule { }
