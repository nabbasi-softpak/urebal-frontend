import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {jqxMenuComponent} from '@jqxSource/angular_jqxmenu';
import {SoftpakMenuComponent} from './softpak-menu.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [jqxMenuComponent, SoftpakMenuComponent],
    exports: [jqxMenuComponent, SoftpakMenuComponent],
})
export class JqxMenuModule {
}
