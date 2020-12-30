import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {jqxTooltipComponent} from "@jqxSource/angular_jqxtooltip";
import {SoftpakTooltipComponent} from "./softpak-tooltip.component";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [jqxTooltipComponent, SoftpakTooltipComponent],
    exports: [jqxTooltipComponent, SoftpakTooltipComponent],
})
export class JqxTooltipModule {
}
