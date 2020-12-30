import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AutocompleteAccountComponent} from "./autocomplete-account.component";
import {JqxComboboxModule} from "../../../jqwidgets/jqx-combobox/jqx-combobox.module";
import {SecurityService} from "../../../../security/security.service";

@NgModule({
    imports: [
        CommonModule,
        JqxComboboxModule
    ],
    declarations: [AutocompleteAccountComponent],
    exports: [AutocompleteAccountComponent],
    providers: [
        SecurityService
    ]
})
export class AutocompleteAccountModule {
}
