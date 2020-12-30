import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttributesListComponent } from './attributes-list/attributes-list.component';
import { AttributeComponent } from './security-attribute/attribute.component'

const routes: Routes = [
  { path: 'list', component: AttributesListComponent },
  { path: 'securities', component: AttributeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttributeRoutingModule { }
