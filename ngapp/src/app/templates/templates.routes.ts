import {Routes} from "@angular/router";
import {TemplateListComponent} from "./template-list/template-list.component";
import {TemplateComponent} from "./template/template.component";
import {AuthGuardService} from "../services/auth-guard.service";


export const templateRoutes: Routes = [
    {
        path: 'list', component: TemplateListComponent,
        data:
            {
                checkSessionValidation: false
            }
    },
    {
        path: 'create', component: TemplateComponent,
        data:
            {
                checkSessionValidation: true,
                permissionName: 'templateCreate'
            },
        canActivate: [AuthGuardService]
    },
    {
        path: 'edit/:templateId', component: TemplateComponent,
        data:
            {
                checkSessionValidation: false
            }
    }
];
