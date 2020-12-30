import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquivalencesListComponent } from './equivalences-list/equivalences-list.component';
import { EquivalencesCreateComponent } from './equivalences-create/equivalences-create.component';

const routes: Routes = [
  {
    path: 'list', component: EquivalencesListComponent,
    data:
      {
        permissionName: 'equivalenceList',
        checkSessionValidation: false
      }
  },
  {
    path: 'equivalence/:equivalenceName', component: EquivalencesCreateComponent,
    data:
      {
        permissionName: 'equivalenceModify',
        checkSessionValidation: false
      }
  },
  {
    path: 'edit-equivalence/:equivalenceId/:equivalenceType', component: EquivalencesCreateComponent,
    data:
      {
        permissionName: 'equivalenceModify',
        checkSessionValidation: false
      }
  },
  {
    path: 'create-equivalence/:equivalenceType', component: EquivalencesCreateComponent,
    data:
      {
        permissionName: 'equivalenceCreate',
        checkSessionValidation: false
      }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquivalanceRoutingModule { }
