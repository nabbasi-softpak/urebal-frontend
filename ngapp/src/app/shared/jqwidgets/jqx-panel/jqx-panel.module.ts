import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {jqxPanelComponent} from "@jqxSource/angular_jqxpanel";
import {SoftpakPanelComponent} from "./softpak-panel.component";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [jqxPanelComponent, SoftpakPanelComponent],
    exports: [jqxPanelComponent, SoftpakPanelComponent],
})
export class JqxPanelModule {
}
