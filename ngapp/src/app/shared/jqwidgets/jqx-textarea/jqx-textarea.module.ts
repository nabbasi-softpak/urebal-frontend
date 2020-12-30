import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {jqxTextAreaComponent} from "@jqxSource/angular_jqxtextarea";
import {SoftpakTextareaComponent} from "./softpak-textarea.component";

@NgModule({
    imports: [CommonModule],
    declarations: [jqxTextAreaComponent, SoftpakTextareaComponent],
    exports: [SoftpakTextareaComponent],
})
export class JqxTextareaModule { }
