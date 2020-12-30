import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SoftpakGridComponent} from './softpak-grid.component';
import {jqxGridComponent} from "@jqxSource/angular_jqxgrid";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [SoftpakGridComponent, jqxGridComponent],
    exports: [SoftpakGridComponent, jqxGridComponent],
})
export class JqxGridModule {
}
