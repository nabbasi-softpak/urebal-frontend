import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributesListComponent } from './attributes-list/attributes-list.component';
import { AttributeComponent } from './security-attribute/attribute.component';

import { AttributeRoutingModule } from './attribute-routing.module';
import {AccountService} from "../account/account.service";

@NgModule({
  imports: [
    CommonModule,
    AttributeRoutingModule
  ],
  declarations: [
    AttributesListComponent,
    AttributeComponent
  ],
  providers: [
    AccountService
  ]
})
export class AttributeModule { }
