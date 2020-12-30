import {TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from '@angular/forms';

import { jqxGridComponent} from '../../../../../src/assets/jqwidgets-ts/angular_jqxgrid';

import { UrebalGridComponent } from '../urebal-grid/urebal-grid.component';
import { URebalService } from '../../../services/urebal.service';

import {UrebalPermissions, PermissionResolverService} from '../../../services/permission-resolver.service';
import {NumberBoundedFormatterDirective} from "../../directives/NumberBoundedFormatter.directive";

xdescribe('UrebalAccountGridTreeComponent', () => {

  let component: UrebalGridComponent;
  let fixture: ComponentFixture<UrebalGridComponent>;
  let debugElement: DebugElement;
  let htmlElement: HTMLElement;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [ UrebalGridComponent, jqxGridComponent, NumberBoundedFormatterDirective],
      imports: [HttpClientModule,FormsModule],
      providers: [
        URebalService,
        UrebalPermissions,
        PermissionResolverService,
        {provide: 'urebalService', useClass: URebalService},
      ]
    });
    fixture = TestBed.createComponent(UrebalGridComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;
  });

  it('should create the urebal tree grid', inject([URebalService, UrebalPermissions],(urebalService, urebalPermissions:UrebalPermissions) => {

    expect(component).toBeTruthy();
  }));


  it('should find textfield with empty text', () => {
    expect(htmlElement.querySelector('input').placeholder).toBe('Search');
  });
});
