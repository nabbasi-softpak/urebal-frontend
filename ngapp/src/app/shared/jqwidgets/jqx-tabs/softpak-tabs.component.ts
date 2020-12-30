import {ChangeDetectionStrategy, Component, ElementRef} from '@angular/core';
import {jqxTabsComponent} from '@jqxSource/angular_jqxtabs';

@Component({
    selector: 'softpak-tabs',
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoftpakTabsComponent extends jqxTabsComponent {

  constructor(containerElement: ElementRef) {
    super(containerElement);
    this.attrTheme = 'softpak'
  }

}
