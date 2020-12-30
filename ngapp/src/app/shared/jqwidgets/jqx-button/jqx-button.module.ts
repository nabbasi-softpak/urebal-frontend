import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {jqxButtonComponent} from '@jqxSource/angular_jqxbuttons';
import {SoftpakButtonComponent} from './softpak-button.component';

@NgModule({
    imports: [CommonModule],
    declarations: [jqxButtonComponent, SoftpakButtonComponent],
    exports: [jqxButtonComponent, SoftpakButtonComponent],
})
export class JqxButtonModule { }
