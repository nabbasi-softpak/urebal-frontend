import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {jqxInputComponent} from '@jqxSource/angular_jqxinput';
import {SoftpakInputComponent} from './softpak-input-component';

@NgModule({
    imports: [
        CommonModule, FormsModule,
    ],
    declarations: [jqxInputComponent, SoftpakInputComponent],
    exports: [jqxInputComponent, SoftpakInputComponent],
})
export class JqxInputModule { }
