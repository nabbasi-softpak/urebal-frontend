import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {jqxRadioButtonComponent} from '@jqxSource/angular_jqxradiobutton';
import {SoftpakRadioButton} from './softpak-radio-button';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [jqxRadioButtonComponent, SoftpakRadioButton],
  exports: [jqxRadioButtonComponent, SoftpakRadioButton],
})
export class JqxRadioButtonModule { }
