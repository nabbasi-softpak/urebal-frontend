import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutocompleteEquivalenceComponent} from './autocomplete-equivalence.component';
import {JqxComboboxModule} from "../../../jqwidgets/jqx-combobox/jqx-combobox.module";
import {EquivalenceService} from "../../../../equivalences/equivalence.service";

@NgModule({
    imports: [
        CommonModule,
        JqxComboboxModule
    ],
    declarations: [AutocompleteEquivalenceComponent],
    exports: [AutocompleteEquivalenceComponent],
    providers: [
        EquivalenceService
    ]
})
export class AutocompleteEquivalenceModule {
}
