import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {SoftpakCheckboxComponent} from './softpak-checkbox.component';
import {jqxCheckBoxComponent} from "../../../../assets/jqwidgets-ts/angular_jqxcheckbox";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [jqxCheckBoxComponent, SoftpakCheckboxComponent],
    exports: [jqxCheckBoxComponent, SoftpakCheckboxComponent],
})
export class JqxCheckboxModule { }
