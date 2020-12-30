import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {SoftpakChartComponent} from "./softpak-chart.component";
import {jqxChartComponent} from "../../../../assets/jqwidgets-ts/angular_jqxchart";

@NgModule({
    imports: [CommonModule],
    declarations: [jqxChartComponent, SoftpakChartComponent],
    exports: [jqxChartComponent, SoftpakChartComponent],
})
export class JqxChartModule { }
