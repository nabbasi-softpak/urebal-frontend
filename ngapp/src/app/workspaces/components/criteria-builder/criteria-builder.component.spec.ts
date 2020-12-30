import {async, TestBed} from '@angular/core/testing';
import { CriteriaBuilderComponent } from './criteria-builder.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {SharedModule} from "../../../shared/shared.module";
import {DriftCriteriaComponent} from "./drift-criteria/drift-criteria.component";
import {ModelCriteriaComponent} from "./model-criteria/model-criteria.component";
import {TaxableCriteriaComponent} from "./taxable-criteria/taxable-criteria.component";
import {MarketValueCriteriaComponent} from "./mkt-val-criteria/mkt-val-criteria.component";
import {HouseholdCriteriaComponent} from "./household-criteria/household-criteria.component";
import {AccountNameCriteriaComponent} from "./acc-name-criteria/acc-name-criteria.component";
import {DragulaService, DragulaModule} from "ng2-dragula";
import {CriteriaService} from "app/workspaces/components/criteria-builder/criteria.service";
import {URebalService} from "../../../services/urebal.service";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";


describe('CriteriaBuilderComponent', () => {
  let component;
  let fixture;
  let debugElement;
  let htmlElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaBuilderComponent, DriftCriteriaComponent, ModelCriteriaComponent, TaxableCriteriaComponent, MarketValueCriteriaComponent, HouseholdCriteriaComponent, AccountNameCriteriaComponent],
      imports: [HttpClientModule, FormsModule, RouterTestingModule, SharedModule, DragulaModule, LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
      })],
      providers: [DragulaService, CriteriaService, URebalService, LocalStorageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaBuilderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create criteria builder', () => {
    expect(component).toBeTruthy();
  });

  it('should check if portfolios are included', () => {
    expect(component.isWorkspaceExists).toBeFalsy();
    htmlElement.querySelector('#checkbox-146').getAttribute('checked');

    let spyEvent = spyOn(htmlElement.querySelector('#checkbox-146'), "click").and.callFake(() => {
      component.isWorkspaceExists = true;
    });

    $('#checkbox-146').click();
    expect(spyEvent).toHaveBeenCalled();
    expect(component.isWorkspaceExists).toBeTruthy();
  });

});
