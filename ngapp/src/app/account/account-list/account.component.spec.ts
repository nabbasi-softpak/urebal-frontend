import { TestBed, async } from '@angular/core/testing';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from "@angular/router/testing"
import { SharedModule } from '../../shared/shared.module'
import { URebalService } from '../../services/urebal.service';
import { AccountComponent } from './account.component';
import { AccountService} from '../account.service';
import {UrebalPermissions, PermissionResolverService} from '../../services/permission-resolver.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import * as $ from "jquery";

xdescribe('AccountComponent', () => {
  let component : AccountComponent;
  let fixture;
  let debugElement;
  let htmlElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [AccountComponent],
        imports: [HttpClientModule, HttpClientTestingModule, FormsModule, RouterTestingModule, SharedModule],
        providers: [
            AccountService,
            URebalService,
            UrebalPermissions,
            PermissionResolverService
          ]
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    //The DebugElement associated with the root element of this component.
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create account list component', () => {
    expect(component).toBeTruthy();
  });

  it('Should have grid search input', () => {
     expect(htmlElement.querySelector('input[id="text-input-01"]').getAttribute('placeholder')).toContain('Search');
   });

   it('grid reload button should be clickable', () => {
     let spyEvent = spyOn(htmlElement.querySelector('.slds-button_icon-border'), "click");

     $('.slds-button_icon-border').trigger('click');
     expect(spyEvent).toHaveBeenCalled();
   });

   it('Grid should contain expected columns', () => {
     let columns = [];
     let expectedColumns = ['Type', 'Account ID', 'Account Name', 'Taxable', 'Free Cash (USD)', 'Free Cash %', 'Core Cash (USD)', 'Core Cash %', 'No. of Holdings', 'Market Value (USD)'];
     for (let column = 0; column < component.accountsList.getColumns()['records'].length; column++) {
       columns.push(component.accountsList.getColumns()['records'][column].text);
     }
     expect(columns).toEqual(expectedColumns);
   });

   it('Grid should contain expected properties on individual column', () => {
     let expectedColumns = [
         {
           'text':'Type',
           'datafield':'houseHold',
           'filterable':false,
           'align':'center',
           'cellsalign':'center'
         },
         {
           'text':'Account ID',
           'datafield':'accountId',
           'filterable':false,
           'align':'center',
           'cellsalign':'left'
         },
         {
           'text':'Account Name',
           'datafield':'portfolioName',
           'filterable':false,
           'align':'center',
           'cellsalign':'left'
         },
         {
           'text':'Taxable',
           'datafield':'taxable',
           'filterable':false,
           'align':'center',
           'cellsalign':'center'
         },
         {
           'text':'Free Cash (USD)',
           'datafield':'freeCash',
           'filterable':false,
           'align':'center',
           'cellsalign':'right'
         },
         {
           'text':'Free Cash %',
           'datafield':'freeCashPercentage',
           'filterable':false,
           'align':'center',
           'cellsalign':'right'
         },
         {
           'text':'Core Cash (USD)',
           'datafield':'cash',
           'filterable':false,
           'align':'center',
           'cellsalign':'right'
         },
         {
           'text':'Core Cash %',
           'datafield':'cashPercentage',
           "cellsformat":"d2",
           'filterable':false,
           'align':'center',
           'cellsalign':'right'
         },
         {
           'text':'No. of Holdings',
           'datafield':'positionsCount',
           'filterable':false,
           'align':'center',
           'cellsalign':'right'
         },
         {
           'text':'Market Value (USD)',
           'datafield':'marketValue',
           "cellsformat":"c0",
           'filterable':false,
           'align':'center',
           'cellsalign':'right'
         }
       ];
     for (let column = 0; column < component.accountsList.getColumns()['records'].length; column++) {
       let properties = Object.keys(expectedColumns[column]);
       for (let property = 0; property < properties.length; property++) {
         expect(component.accountsList.getColumns()['records'][column][properties[property]]).toEqual(expectedColumns[column][properties[property]]);
       }
     }
   });

  it('Grid should contain properties', () => {

    expect(component.accountsList.columnReorder).toBeFalsy();
    expect(component.accountsList.columnResize).toBeFalsy();
    expect(component.accountsList.debug).toBeFalsy();
    expect(component.accountsList.editable).toBeFalsy();
    expect(component.accountsList.displayHeader).toBeTruthy();
    expect(component.accountsList.settings.selectionmode).toEqual('singlerow');

  });
});
