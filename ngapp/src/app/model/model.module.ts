import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedModule} from '../shared/shared.module';
import {ModelRoutingModule} from './model-routing.module';

import {ModelComponent} from './model-list/model.component';
import {SecurityModelComponent} from './security-model/security-model.component';
import {ModelBuilderComponent} from './components/model-builder/model-builder.component';
import {ModelSecuritiesComponent} from './components/model-builder/model-securities/model-securities.component';
import {AttributeModelComponent} from './attribute-model/attribute-model.component';
import {ModelDetailComponent} from './model-detail/model-detail.component';
import {CompositeModelComponent, StringToIntegerConversionDirective} from './composite-model/composite-model.component';
import {ModelService} from './model.service';
import {SecurityAdvancedSearchComponent} from "../security/components/security-advanced-search/security-advanced-search.component";
import {SecurityService} from '../security/security.service';
import {DialogModalComponent} from "../shared/components/dialog-modal/dialog-modal.component";
import {MessageModalComponent} from "../shared/components/message-modal/message-modal.component";
import {AutocompleteSecurityModule} from "../shared/components/autocomplete/autocomplete-security/autocomplete-security.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ModelRoutingModule,
        AutocompleteSecurityModule
    ],
    declarations: [
        ModelComponent,
        SecurityModelComponent,
        ModelBuilderComponent,
        ModelSecuritiesComponent,
        AttributeModelComponent,
        ModelDetailComponent,
        CompositeModelComponent,
        StringToIntegerConversionDirective,
        SecurityAdvancedSearchComponent,
    ],
    exports: [
        DialogModalComponent,
        MessageModalComponent
    ],
    providers: [
        ModelService,
        SecurityService
    ]
})
export class ModelModule {
}
