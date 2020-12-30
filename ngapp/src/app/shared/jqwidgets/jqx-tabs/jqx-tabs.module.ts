import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SoftpakTabsComponent } from './softpak-tabs.component';
import {jqxTabsComponent} from "@jqxSource/angular_jqxtabs";

@NgModule({
  declarations: [SoftpakTabsComponent, jqxTabsComponent],
  imports: [
    CommonModule,
  ],
    exports: [SoftpakTabsComponent],
})
export class JqxTabsModule { }
