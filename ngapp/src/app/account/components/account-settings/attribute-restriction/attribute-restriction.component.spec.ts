import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';
import { SecurityAndModelComponent } from '../../../../shared/components/autocomplete/security-and-model/security-and-model.component';
import { DefaultComponent} from '../../../../shared/components/autocomplete/default/default.component';
import { PortfolioComponent} from '../../../../shared/components/autocomplete/portfolio/portfolio.component';
import { ModelComponent} from '../../../../shared/components/autocomplete/model/model.component';
import { DriftedAccountComponent } from '../../../../shared/components/autocomplete/drifted-account/drifted-account.component';
import { SecurityComponent } from '../../../../shared/components/autocomplete/security/security.component';
import { AccountComponent } from '../../../../shared/components/autocomplete/account/account.component';
import { EquivalenceComponent } from '../../../../shared/components/autocomplete/equivalence/equivalence.component';
import { AccountService } from '../../../account.service';
import { ModelService } from '../../../../model/model.service';
import {PercentageDirective} from '../../../../shared/directives/Percentage.directive';

import { AttributeRestrictionComponent } from './attribute-restriction.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {SharedModule} from "../../../../shared/shared.module";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";

describe('AttributeRestrictionComponent', () => {
  let component;
  let fixture;
  let debugElement;
  let htmlElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AttributeRestrictionComponent
      ],
      providers: [
          AccountService,
          ModelService,
          LocalStorageService
      ],
      imports: [
          HttpClientModule,
          FormsModule,
          HttpClientTestingModule,
          SharedModule,
          LocalStorageModule.forRoot({
              prefix: 'urebal-app',
              storageType: "localStorage"
          })]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeRestrictionComponent);
    component = fixture.componentInstance;
    //The DebugElement associated with the root element of this component.
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create attribute restriction component', () => {
    expect(component).toBeTruthy();
  });

  it('Element should reflect data binding value', () => {

    const response = {
      "code":200,
      "message":"Account is fetched.",
      "responsedata":[
        {
          "accountID":"AK_ACC_2",
          "min":2,
          "max":3,
          "attributes":
            {
              "attributeID":703,
              "attributeName":"A",
              "attributeType":"AA",
              "securities":
                [
                  {
                    "securityID":"E",
                    "attributeValue":100
                  },
                  {
                    "securityID":"F",
                    "attributeValue":100
                  },
                  {
                    "securityID":"D",
                    "attributeValue":100
                  },
                  {
                    "securityID":"G",
                    "attributeValue":100
                  }
                ]
            },
          "restrictionType":null
        },
        {
          "accountID":"AK_ACC_2",
          "min":2,
          "max":3,
          "attributes":
            {
              "attributeID":403,
              "attributeName":"123",
              "attributeType":"11",
              "securities":[
                {
                  "securityID":"ACV",
                  "attributeValue":100
                },
                {
                  "securityID":"ABT",
                  "attributeValue":100
                },
                {
                  "securityID":"AAPL",
                  "attributeValue":100
                }
              ]
            },
          "restrictionType":null
        },
        {
          "accountID":"AK_ACC_2",
          "min":3,
          "max":3,
          "attributes":
            {
              "attributeID":416,
              "attributeName":"ASDF",
              "attributeType":"3 BAGGINS",
              "securities":
                [
                  {
                    "securityID":"ABC",
                    "attributeValue":100
                  },
                  {
                    "securityID":"XYZ",
                    "attributeValue":100
                  }
                ]
            },
          "restrictionType":null
        }
      ]
    };

    component.attributeRestrictions = response.responsedata;

    fixture.detectChanges();

    expect($('#addedRestrictionsTable').children('tbody').children('tr').length).toEqual(3);

  });
});
