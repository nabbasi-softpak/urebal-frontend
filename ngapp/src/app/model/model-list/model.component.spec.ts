import { async, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from "@angular/router/testing"
import { Router } from '@angular/router';

import { SharedModule } from '../../shared/shared.module'
import { ModelComponent } from './model.component';
import { ModelService } from '../model.service';
import {URebalService} from '../../services/urebal.service';

import {UrebalPermissions, PermissionResolverService} from '../../services/permission-resolver.service';
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";


describe('ModelComponent', () => {
  let component;
  let fixture;
  let debugElement;
  let htmlElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelComponent ],
      imports : [HttpClientModule, FormsModule, RouterTestingModule, SharedModule, LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
      })],
      providers: [
          URebalService,
          ModelService,
          UrebalPermissions,
          PermissionResolverService,
          LocalStorageService,
          {
            provide: Router, useClass: class {
              navigate = jasmine.createSpy("navigate");
            }
          }
      ],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelComponent);
    component = fixture.componentInstance;
    //The DebugElement associated with the root element of this component.
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;
    fixture.detectChanges();

  });

  it('should create Model component', () => {
    expect(component).toBeTruthy();
  });

  xit('Should have search input', () => {
    expect(htmlElement.querySelector('input[id="text-input-01"]').getAttribute('placeholder')).toContain('Search');
    expect(htmlElement.querySelector('.slds-page-header__title').textContent).toContain('Model List');
  });

  it('Grid should contain expected columns', () => {
    let columns = [];
    let expectedColumns = ['Status', 'Model ID', 'Model Name', 'Model Type', 'Securities', 'Asset Classes', 'Cash Target %', 'Assigned Account', 'Action'];
    for (let column = 0; column < component.modelsList.getColumns().records.length; column++) {
      columns.push(component.modelsList.getColumns().records[column].text);
    }
    expect(columns).toEqual(expectedColumns);
  });

  it('Grid should contain expected properties on individual column', () => {
    let expectedColumns = [
      {
        'text':'Status',
        'datafield':'impartial',
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Model ID',
        'datafield':'modelId',
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
        'text':'Model Type',
        'datafield':'modelType',
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Securities',
        'datafield':'elementsCount',
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Asset Classes',
        'datafield':'subModelsCount',
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Cash Target %',
        'datafield':'cashTargetPctWt',
        "cellsformat":"d2",
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Assigned Account',
        'datafield':'assignedAccountsCount',
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Action',
        'align':'center',
        'cellsalign':'right'
      }
    ];

    for (let column = 0; column < component.modelsList.getColumns().records.length; column++) {

      for (let column = 0; column < component.modelsList.getColumns().records.length; column++) {
        let properties = Object.keys(expectedColumns[column]);
        for (let property = 0; property < properties.length; property++) {
          expect(component.modelsList.getColumns().records[column][properties[property]]).toEqual(expectedColumns[column][properties[property]]);
        }

      }

    }

  });

  it('Grid should contain properties', () => {

    expect(component.modelsList.columnReorder).toBeFalsy();
    expect(component.modelsList.columnResize).toBeFalsy();
    expect(component.modelsList.debug).toBeFalsy();
    expect(component.modelsList.editable).toBeFalsy();
    expect(component.modelsList.autoHeight).toBeFalsy();
    expect(component.modelsList.displayHeader).toBeTruthy();
    expect(component.modelsList.settings.selectionmode).toEqual('none');

  });

  it('Should redirect to given path', () => {

    let router = fixture.debugElement.injector.get(Router);
    //Place an SPY on redirectToModels method
    spyOn(component, 'redirectToModels').and.callThrough();

    //call redirectToModels()
    component.redirectToModels();
    //test navigation to be called to model/list
    expect(router.navigate).toHaveBeenCalledWith(['/secure/model/list']);
    //test redirectToModels method called
    expect(component.redirectToModels).toHaveBeenCalled();
  });

});
