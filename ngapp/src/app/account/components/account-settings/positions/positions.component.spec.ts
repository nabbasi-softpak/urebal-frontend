import { TestBed, async } from '@angular/core/testing';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from "@angular/router/testing"
import { SharedModule } from '../../../../shared/shared.module'
import { URebalService } from '../../../../services/urebal.service';
import { PositionsComponent } from './positions.component';
import { AccountService } from '../../../account.service';
import {UrebalPermissions, PermissionResolverService} from '../../../../services/permission-resolver.service';
import * as $ from "jquery";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";

describe('PositionsComponent', () => {
  let component;
  let fixture;
  let debugElement;
  let htmlElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionsComponent ],
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
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionsComponent);
    component = fixture.componentInstance;
    //The DebugElement associated with the root element of this component.
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create account position component', () => {
    expect(component).toBeTruthy();
  });

  it('Should have search input', () => {
    expect(htmlElement.querySelector('input[id="text-input-01"]').getAttribute('placeholder')).toContain('Search');
  });

  it('grid reload button should be clickable', () => {
    let spyEvent = spyOn(htmlElement.querySelector('.slds-button_icon'), "click");

    $('.slds-button_icon').trigger('click');
    expect(spyEvent).toHaveBeenCalled();
  });

  it('Grid should contain expected columns', () => {
    let columns = [];
    let expectedColumns = ['Security ID', 'Security Name', 'Shares', 'Basis Price (USD)', 'Purchase Date'];
    for (let column = 0; column < component.positionsGrid.getColumns().records.length; column++) {
      columns.push(component.positionsGrid.getColumns().records[column].text);
    }
    expect(columns).toEqual(expectedColumns);
  });

  it('Grid should contain expected properties on individual column', () => {
    let expectedColumns = [
      {
        'text':'Security ID',
        'datafield':'ticker',
        'editable' :false,
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Security Name',
        'datafield':'tickerName',
        'editable' :false,
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Shares',
        'datafield':'shares',
        'editable' :false,
        'cellsformat': 'd2',
        'align':'center',
        'cellsalign':'right'
      },

      {
        'text':'Basis Price (USD)',
        'datafield':'basisPrice',
        'editable' :false,
        'cellsformat': 'c2',
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Purchase Date',
        'datafield':'buyDate',
        'editable' :false,
        'align':'center',
        'cellsalign':'right'
      }
    ];

    for (let column = 0; column < component.positionsGrid.getColumns().records.length; column++) {

      for (let column = 0; column < component.positionsGrid.getColumns().records.length; column++) {
        let properties = Object.keys(expectedColumns[column]);
        for (let property = 0; property < properties.length; property++) {
          expect(component.positionsGrid.getColumns().records[column][properties[property]]).toEqual(expectedColumns[column][properties[property]]);
        }

      }

    }

  });

  it('Grid should contain properties', () => {

    expect(component.positionsGrid.columnReorder).toBeFalsy();
    expect(component.positionsGrid.columnResize).toBeFalsy();
    expect(component.positionsGrid.editable).toBeTruthy();
    expect(component.positionsGrid.displayHeader).toBeFalsy();
    expect(component.positionsGrid.autoHeight).toBeTruthy();
  });
});
