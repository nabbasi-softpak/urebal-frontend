import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkspaceComponent } from './workspace.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {SharedModule} from "../../shared/shared.module";
import {WorkspaceService} from "../workspace.service";
import {URebalService} from "../../services/urebal.service";
import {PermissionResolverService, UrebalPermissions} from "../../services/permission-resolver.service";
import * as $ from "jquery";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";

describe('WorkspaceComponent', () => {
  let component;
  let fixture;
  let debugElement;
  let htmlElement;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceComponent ],
      imports: [HttpClientModule, FormsModule, RouterTestingModule, SharedModule, LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
      })],
      providers: [
        WorkspaceService,
        URebalService,
        UrebalPermissions,
        PermissionResolverService,
        LocalStorageService
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create workspace list component', () => {
    expect(component).toBeTruthy();
  });

  it('Should have grid search input', () => {
    expect(htmlElement.querySelector('input[id="text-input-01"]').getAttribute('placeholder')).toContain('Search');
  });

  it('grid reload button should be clickable', () => {
    let spyEvent = spyOn(htmlElement.querySelector('.slds-button_icon'), "click");

    $('.slds-button_icon').trigger('click');
    expect(spyEvent).toHaveBeenCalled();
  });

  it('Grid should contain expected columns', () => {
    let columns = [];
    let expectedColumns = ['Rebalance ID', 'Rebalance Name', 'No. of Accounts', 'No. of Households', 'Total Market Value (USD)', 'Action'];
    for (let column = 0; column < component.workspacelist.getColumns().records.length; column++) {
      columns.push(component.workspacelist.getColumns().records[column].text);
    }
    expect(columns).toEqual(expectedColumns);
  });

  it('Grid should contain expected properties on individual column', () => {
    let expectedColumns = [
      {
        'text':'Rebalance ID',
        'align':'center',
        'cellsalign':'right',
        'datafield':'workflowId'
      },
      {
        'text':'Rebalance Name',
        'align':'center',
        'datafield':'name'
      },
      {
        'text':'No. of Accounts',
        'align':'center',
        'cellsalign':'right',
        'datafield':'totalAccounts'
      },
      {
        'text':'No. of Households',
        'align':'center',
        'cellsalign':'right',
        'datafield':'totalHouseholds'
      },
      {
        'text':'Total Market Value (USD)',
        'align':'center',
        'cellsalign':'right',
        'datafield':'totalMktVal'
      },
      {
        'text':'Action',
        'align':'center',
        'cellsalign':'center'
      }
    ];
    for (let column = 0; column < component.workspacelist.getColumns().records.length; column++) {
      let properties = Object.keys(expectedColumns[column]);
      for (let property = 0; property < properties.length; property++) {
        expect(component.workspacelist.getColumns().records[column][properties[property]]).toEqual(expectedColumns[column][properties[property]]);
      }
    }
  });

  it('Grid should contain properties', () => {

    expect(component.workspacelist.displayHeader).toBeTruthy();
    expect(component.workspacelist.panelTitle).toBe('Rebalance List');
    expect(component.workspacelist.autoHeight).toBeFalsy();
    expect(component.workspacelist.columnReorder).toBeFalsy();
    expect(component.workspacelist.columnResize).toBeFalsy();
    expect(component.workspacelist.pageable).toBeTruthy();
    expect(component.workspacelist.gridId).toBe('workspacelist');
  });

});
