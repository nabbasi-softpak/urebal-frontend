import { TestBed, async } from '@angular/core/testing';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from "@angular/router/testing"

import { SharedModule } from '../../../../shared/shared.module'
import { URebalService } from '../../../../services/urebal.service';

import { WashsalesComponent } from './washsales.component';
import { AccountService } from '../../../account.service';

import {UrebalPermissions, PermissionResolverService} from '../../../../services/permission-resolver.service';
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";


describe('WashsalesComponent', () => {
  let component;
  let fixture;
  let debugElement;
  let htmlElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashsalesComponent ],
      imports: [HttpClientModule, FormsModule, RouterTestingModule, SharedModule, LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
      })],
      providers: [
        AccountService,
        URebalService,
        UrebalPermissions,
        PermissionResolverService,
        LocalStorageService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashsalesComponent);
    component = fixture.componentInstance;
    //The DebugElement associated with the root element of this component.
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;

    // === This is to skip/bypass permissions (temporary solution - need to find a proper way of checking permissions) ====//
    component.userPermissions.forEach((value: boolean, key: string) => {
      component.permissionset.push({ "permissionName" : value, "permissionDescription" : "" });
    });
    //===========================================//

    fixture.detectChanges();
  });

  it('should create wash sales component', () => {
    expect(component).toBeTruthy();
  });

  it('Grid should contain expected columns', () => {
    let columns = [];
    let expectedColumns = ['Security ID', 'Security Name', 'Sell Date'];
    for (let column = 0; column < component.grid.getColumns().records.length; column++) {
      columns.push(component.grid.getColumns().records[column].text);
    }
    expect(columns).toEqual(expectedColumns);
  });

  it('Grid should contain expected properties on individual column', () => {
    let expectedColumns = [
      {
        'text':'Security ID',
        'datafield':'ticker',
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Security Name',
        'datafield':'tickerName',
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Sell Date',
        'datafield':'sellDate',
        'cellsformat':'MMM dd, yyyy',
        'align':'center',
        'cellsalign':'right'
      }
    ];

    for (let column = 0; column < component.grid.getColumns().records.length; column++) {

      for (let column = 0; column < component.grid.getColumns().records.length; column++) {
        let properties = Object.keys(expectedColumns[column]);
        for (let property = 0; property < properties.length; property++) {
          expect(component.grid.getColumns().records[column][properties[property]]).toEqual(expectedColumns[column][properties[property]]);
        }

      }

    }

  });

  it('Grid should contain properties', () => {

    expect(component.grid.columnReorder).toBeFalsy();
    expect(component.grid.columnResize).toBeFalsy();
    expect(component.grid.debug).toBeFalsy();
    expect(component.grid.editable).toBeFalsy();
    expect(component.grid.displayHeader).toBeFalsy();
    expect(component.grid.autoHeight).toBeTruthy();
    expect(component.grid.settings.selectionmode).toEqual('none');

  });
});
