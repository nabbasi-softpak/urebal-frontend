import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import { SoftpakDropdownComponent } from './softpak-dropdown.component';
import {jqxDropDownListComponent} from "@jqxSource/angular_jqxdropdownlist";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [jqxDropDownListComponent, SoftpakDropdownComponent],
    exports: [jqxDropDownListComponent, SoftpakDropdownComponent],
})
export class JqxDropdownModule {
}
