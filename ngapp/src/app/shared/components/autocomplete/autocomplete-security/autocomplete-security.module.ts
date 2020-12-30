import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AutocompleteSecurityComponent} from "./autocomplete-security.component";
import {JqxComboboxModule} from "../../../jqwidgets/jqx-combobox/jqx-combobox.module";
import {SecurityService} from "../../../../security/security.service";

@NgModule({
    imports: [
        CommonModule,
        JqxComboboxModule
    ],
    declarations: [AutocompleteSecurityComponent],
    exports: [AutocompleteSecurityComponent],
    providers: [
        SecurityService
    ]
})
export class AutocompleteSecurityModule {
}
