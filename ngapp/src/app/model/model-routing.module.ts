import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ModelComponent} from './model-list/model.component';
import {SecurityModelComponent} from './security-model/security-model.component';
import {AttributeModelComponent} from './attribute-model/attribute-model.component';
import {ModelDetailComponent} from './model-detail/model-detail.component';
import {CompositeModelComponent} from './composite-model/composite-model.component';
import {AuthGuardService} from "../services/auth-guard.service";

const routes: Routes = [
  { path: 'list',component: ModelComponent,
    data :
      {
        permissionName: 'modelList',
        checkSessionValidation: false
      }, canActivate : [AuthGuardService]
  },
  { path: 'securityModel', component: SecurityModelComponent,
    data :
      {
        permissionName: 'modelCreateSecurityModel',
        checkSessionValidation: false
      }, canActivate : [AuthGuardService]
  },
  { path: 'securityModel/edit/:modelId', component: SecurityModelComponent,
    data :
      {
        permissionName: 'modelModifySecurityModel',
        checkSessionValidation: false
      }, canActivate : [AuthGuardService]
  },{ path: 'securityModel/:modelId/:isCopyAction', component: SecurityModelComponent,
    data :
      {
        permissionName: 'modelCloneSecurityModel',
        checkSessionValidation: false
      }, canActivate : [AuthGuardService]
  },
  { path: 'detail/:modelId', component: ModelDetailComponent, canActivate : [AuthGuardService]
  },
  { path: 'compositemodel/:modelName/:modelId', component: CompositeModelComponent,
    data :
      {
        permissionName: 'modelModifyModelOfModel',
        checkSessionValidation: false
      }, canActivate : [AuthGuardService]
  },
  { path: 'compositemodel/:modelName/:modelId/:action', component: CompositeModelComponent,
    data :
      {
        permissionName: 'modelCloneModelOfModel',
        checkSessionValidation: false
      }, canActivate : [AuthGuardService]
  },
  { path: 'compositemodel',component: CompositeModelComponent,
    data :
      {
        permissionName: 'modelCreateModelOfModel',
        checkSessionValidation: false
      }, canActivate : [AuthGuardService]
  },
  { path: 'attributeModel', component: AttributeModelComponent,
    data :
      {
        permissionName: 'modelCreateAssetModel',
        checkSessionValidation: false
      }, canActivate : [AuthGuardService]
  },
  { path: 'attributeModel/:modelName/:modelId', component: AttributeModelComponent,
    data :
      {
        permissionName: 'modelModifyAssetModel',
        checkSessionValidation: false
      }, canActivate : [AuthGuardService]
  },
  { path: 'attributeModel/:modelName/:modelId/:action', component: AttributeModelComponent,
    data :
      {
        permissionName: 'modelCloneAssetModel',
        checkSessionValidation: false
      }, canActivate : [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelRoutingModule { }
