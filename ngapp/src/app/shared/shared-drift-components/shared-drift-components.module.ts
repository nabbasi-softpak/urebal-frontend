import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../shared.module";
import {DragulaModule} from "ng2-dragula";
import {FormsModule} from "@angular/forms";
import {DriftsListComponent} from "../../drifts/drifts-list/drifts.list.component";
import {DriftDetailsComponent} from "../../drifts/drift-details/drift-details.component";
import {jqxTooltipComponent} from "../../../assets/jqwidgets-ts/angular_jqxtooltip";
import {JqxTooltipModule} from "../jqwidgets/jqx-tooltip/jqx-tooltip.validator";
import {JqxInputModule} from "../jqwidgets/jqx-input/jqx-input.module";
import {ApplyEquivalenceModalComponent} from "../../drifts/apply-equivalence-modal/apply-equivalence-modal.component";
import {AutocompleteEquivalenceModule} from "../components/autocomplete/autocomplete-equivalence/autocomplete-equivalence.module";

@NgModule({
  imports: [
    CommonModule,
    DragulaModule,
    FormsModule,
    SharedModule,
    JqxTooltipModule,
    JqxInputModule,
    AutocompleteEquivalenceModule
  ],
  declarations: [
    DriftsListComponent,
    DriftDetailsComponent,
    ApplyEquivalenceModalComponent
  ],
  exports: [
    DriftsListComponent,
    DriftDetailsComponent,
    jqxTooltipComponent,
    ApplyEquivalenceModalComponent
  ]
})
export class SharedDriftComponentsModule { }
