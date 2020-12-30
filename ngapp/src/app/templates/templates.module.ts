import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TemplateListComponent} from "./template-list/template-list.component";
import {TemplatesRoutingModule} from "./templates-routing.module";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import { TemplateComponent } from './template/template.component';
import {TemplateService} from "./template.service";
import {WorkspaceService} from "../workspaces/workspace.service";
import {ModelService} from "../model/model.service";
import {AccountService} from "../account/account.service";


@NgModule({
    declarations: [
        TemplateListComponent,
        TemplateComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        TemplatesRoutingModule
    ],
    providers: [
        TemplateService,
        WorkspaceService,
        ModelService,
        AccountService
    ]
})
export class TemplatesModule {
}
