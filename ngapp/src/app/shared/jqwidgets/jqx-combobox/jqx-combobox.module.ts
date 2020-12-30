import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {jqxComboBoxComponent} from "@jqxSource/angular_jqxcombobox";
import {SoftpakComboBoxComponent} from "./softpak-combobox.component";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [jqxComboBoxComponent, SoftpakComboBoxComponent],
    exports: [jqxComboBoxComponent, SoftpakComboBoxComponent],
})
export class JqxComboboxModule {
}
