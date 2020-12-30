import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';
import { SecurityComponent } from '../../../../shared/components/autocomplete/security/security.component';
import { SecurityAndModelComponent } from '../../../../shared/components/autocomplete/security-and-model/security-and-model.component';
import { PortfolioComponent} from '../../../../shared/components/autocomplete/portfolio/portfolio.component';
import { DriftedAccountComponent } from '../../../../shared/components/autocomplete/drifted-account/drifted-account.component';
import { AccountComponent } from '../../../../shared/components/autocomplete/account/account.component';
import { ModelComponent} from '../../../../shared/components/autocomplete/model/model.component';
import { DefaultComponent } from '../../../../shared/components/autocomplete/default/default.component';
import { EquivalenceComponent } from '../../../../shared/components/autocomplete/equivalence/equivalence.component';
import { RestrictionsComponent } from './restrictions.component';
import { AccountService } from '../../../account.service';
import { ModelService } from '../../../../model/model.service';
import {PercentageDirective} from '../../../../shared/directives/Percentage.directive';
import {URebalService} from "../../../../services/urebal.service";
import {SharedModule} from "../../../../shared/shared.module";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";


describe('RestrictionsComponent', () => {
  let component;
  let fixture;
  let debugElement;
  let htmlElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RestrictionsComponent
      ],
      providers: [AccountService,ModelService, URebalService, LocalStorageService],
      imports: [HttpClientModule,FormsModule, SharedModule,
          LocalStorageModule.forRoot({
              prefix: 'urebal-app',
              storageType: "localStorage"
          })]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictionsComponent);
    component = fixture.componentInstance;
    //The DebugElement associated with the root element of this component.
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create account restriction component', () => {
    expect(component).toBeTruthy();
  });

  it('Element should reflect data binding value', () => {

    const response = {
      "code":200,
      "message":"Account is fetched.",
      "responsedata":[
        {
          "id":14047,
          "ticker":"$CASH",
          "restrictionType":5,
          "min":0,
          "max":0,
          "accountId":"AK_ACC_2",
          "isMaxAvailable":true,
          "isMinAvailable":true,
          "restrictionTypeName":"Custom Weights %",
          "isPriceMiss":null
        },
        {
          "id":14048,
          "ticker":"$CASH",
          "restrictionType":1,
          "min":0,
          "max":0,
          "accountId":"AK_ACC_2",
          "isMaxAvailable":true,
          "isMinAvailable":true,
          "restrictionTypeName":"Minimum Core Cash %",
          "isPriceMiss":null
        }
      ]
    };

    component.accountRestrictions = response.responsedata;
    component.restrictionsCount = response.responsedata.length;

    fixture.detectChanges();

    expect($('.slds-table').children('tbody').children('tr').length).toEqual(4);

  });

});
