import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {jqxValidatorComponent} from '@jqxSource/angular_jqxvalidator';
import {SoftpakValidatorComponent} from './softpak-validator.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [jqxValidatorComponent, SoftpakValidatorComponent],
    exports: [jqxValidatorComponent, SoftpakValidatorComponent],
})
export class JqxValidatorModule {
}
