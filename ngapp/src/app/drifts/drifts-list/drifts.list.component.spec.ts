import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from "@angular/router/testing"

import { SharedModule } from '../../shared/shared.module'
import { URebalService } from '../../services/urebal.service';

import { DriftsListComponent } from './drifts.list.component';
import { DriftService } from '../drift.service';

import {UrebalPermissions, PermissionResolverService} from '../../services/permission-resolver.service';
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";


describe('DriftsComponent', () => {
  let component: DriftsListComponent;
  let fixture: ComponentFixture<DriftsListComponent>;

  //The DebugElement associated with the root element of this component.
  let debugElement: DebugElement;
  let htmlElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriftsListComponent ],
      imports: [HttpClientModule, FormsModule, RouterTestingModule, SharedModule, LocalStorageModule.forRoot({
        prefix: 'urebal-app',
        storageType: "localStorage"
      })],
      providers: [
        DriftService,
        URebalService,
        UrebalPermissions,
        PermissionResolverService,
        LocalStorageService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriftsListComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  /*it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('Grid should contain expected columns', () => {
    let columns = [];
    let expectedColumns = ['Type', 'Account ID', 'Account Name', 'Tax Status', 'Drift Status', 'Drift %', 'Model Name', 'Market Value', 'Available Cash', 'Cash Drift', 'Last Rebalanced'];
    for (let column = 0; column < component.driftsList.getColumns().records.length; column++) {
      columns.push(component.driftsList.getColumns().records[column].text);
    }
    expect(columns).toEqual(expectedColumns);
  });

  it('Grid should contain expected properties on individual column', () => {
    let expectedColumns = [
      {
        'text':'Type',
        'datafield':'isHouseHold',
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Account ID',
        'datafield':'accountId',
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Account Name',
        'datafield':'portfolioName',
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Tax Status',
        'datafield':'taxStatus',
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Drift Status',
        'datafield':'driftStatus',
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Drift %',
        'datafield':'drift',
        'cellsformat': 'd2',
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Model Name',
        'datafield':'modelName',
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Market Value',
        'datafield':'marketValue',
        'cellsformat':'c0',
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Available Cash',
        'datafield':'coreCash',
        'cellsformat': 'c0',
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Cash Drift',
        'datafield':'cashDrift',
        'cellsformat': 'd2',
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Last Rebalanced',
        'datafield':'lastRebalanced',
        "cellsformat":"MMM dd, yyyy hh:mm tt",
        'align':'center',
        'cellsalign':'center',
      },
    ];

    for (let column = 0; column < component.driftsList.getColumns().records.length; column++) {
      let properties = Object.keys(expectedColumns[column]);
      for (let property = 0; property < properties.length; property++) {
        //console.log(expectedColumns[column][properties[property]] + '-----' + component.driftsList.getColumns().records[column][properties[property]])
        expect(component.driftsList.getColumns().records[column][properties[property]]).toEqual(expectedColumns[column][properties[property]]);
      }

    }

  });

  it('Grid should contain properties', () => {

    expect(component.driftsList.displayHeader).toBeTruthy();
    expect(component.driftsList.columnReorder).toBeTruthy();
    expect(component.driftsList.columnResize).toBeFalsy();
    expect(component.driftsList.debug).toBeFalsy();
    expect(component.driftsList.settings.editable).toBeFalsy();
    expect(component.driftsList.settings.selectionmode).toEqual('singlecell');

  });
*/
});
