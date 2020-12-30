import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from "@angular/router";
import { of} from 'rxjs'
import { AccountDetailComponent } from './account-detail.component';
import { SharedModule } from '../../shared/shared.module';
import {AccountService, DriftStatus} from '../account.service';
import { DriftService } from '../../drifts/drift.service';
import { PortfolioService } from '../portfolio.service';
import {URebalUtil} from "../../shared/util/URebalUtil";
import {ModelService} from "../../model/model.service";
import {URebalService} from "../../services/urebal.service";
import * as $ from "jquery";
import {UrebalPermissions, PermissionResolverService} from '../../services/permission-resolver.service';
import {SharedWorkspaceAccountModule} from "../../shared/shared-workspace-account/shared-workspace-account.module";

//TODO: uncomment the followings
/*describe('AccountDetailComponent single account', () => {
  let component;
  let fixture;
  let debugElement;
  let htmlElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [SharedModule, FormsModule, HttpClientModule, RouterTestingModule, SharedWorkspaceAccountModule],
      providers: [
        DriftService,
        AccountService,
        PortfolioService,
        ModelService,
        URebalService,
        PermissionResolverService,
        UrebalPermissions,
        { provide: ActivatedRoute, useValue: {
          params: of({
            'portfolioId': encodeURIComponent('2045'),//TEST-HH
            'portfolioName': encodeURIComponent('ACC-PK-AUTO-66'),//TEST-HH
            'household': 'false'})
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDetailComponent);
    component = fixture.componentInstance;
    //The DebugElement associated with the root element of this component.
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;
    component.driftDetails = {driftStatus:DriftStatus.STATUS_UNASSINGED}
    component.drift = {securityDriftColor:'red'}
    fixture.detectChanges();
  });

  it('should create account detail component and verify query params', () => {
    expect(component).toBeTruthy();
    expect(component.portfolioId).toEqual(2045);
    expect(component.portfolioName).toEqual('ACC-PK-AUTO-66');
    expect(component.isHouseHold).toEqual(false);
  });

  it('Should not contains left side bar list of accounts in case of household', () => {
    expect(htmlElement.querySelector('.slds-size--2-of-12')).toBeNull();
  });

  it('Should not contains defined tabs and verify their names', () => {
    let tabs = ['Overview', 'Drift', 'Positions','Tax Settings','Restrictions', 'Attribute Restrictions', 'Washsales'];

    fixture.detectChanges();

    expect($('ul.report-tabs li').length).toEqual(tabs.length);

    $('ul.report-tabs li').each((i, li)=>{
      expect($(li).find('a').find('h3').find('span').text()).toEqual(tabs[i]);
      $(li).trigger('click');
      expect($('#'+$(li).find('a').data('target')).is(":visible")).toBeTruthy();
    })

  });

});


xdescribe('AccountDetailComponent household account', () => {
  let component;
  let fixture;
  let debugElement;
  let htmlElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [SharedModule, FormsModule, HttpClientModule, RouterTestingModule, SharedWorkspaceAccountModule],
      providers: [
        DriftService,
        AccountService,
        PortfolioService,
        ModelService,
        URebalService,
        PermissionResolverService,
        UrebalPermissions,
        { provide: ActivatedRoute, useValue: {
          params: of({
            'portfolioId': URebalUtil.encodeparams('2046'),//TEST-HH
            'portfolioName': URebalUtil.encodeparams('TEST-HH'),//TEST-HH
            'household': URebalUtil.encodeparams('true')})
        }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDetailComponent);
    component = fixture.componentInstance;
    //The DebugElement associated with the root element of this component.
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement
    fixture.detectChanges();
  });

  it('should create account detail component and verify query params', () => {
    expect(component).toBeTruthy();
    expect(component.portfolioId).toEqual(2046);
    expect(component.portfolioName).toEqual('TEST-HH');
    expect(component.isHouseHold).toEqual(true);
  });

  it('Should contains left side bar list of accounts in case of household', () => {
    expect(htmlElement.querySelector('.tiny-sidebar')).not.toBeNull();
    expect(htmlElement.querySelector('#accountListHeader').textContent).toEqual('Accounts in Household');
    component.accountListSearch = [{id:"48-1240"},{id:"YF_AR_1"}];
    fixture.detectChanges();
    expect($('ul.accounts-selection li').length).toBeGreaterThan(1);
  });

  it('Should filter left side bar list of accounts on search', () => {
    component.accountListSearch = [{id:"48-1240"},{id:"YF_AR_1"}];
    component.accountList = [{id:"48-1240"},{id:"YF_AR_1"}];
    let value = {
      target:{
        value:'YF'
      }
    };

    component.filterAccount(value);

    expect(component.accountListSearch.length).toEqual(1);
  });

  it('Should not contains defined tabs and verify their names', () => {
    let tabs = ['Overview', 'Drift', 'Positions','Tax Settings','Restrictions', 'Attribute Restrictions', 'Washsales'];

    fixture.detectChanges();

    expect($('ul.report-tabs li').length).toEqual(tabs.length);

    $('ul.report-tabs li').each((i, li)=>{
      expect($(li).find('a').find('h3').find('span').text()).toEqual(tabs[i]);
      $(li).trigger('click');
      expect($('#'+$(li).find('a').data('target')).is(":visible")).toBeTruthy();
    })

  });

});*/

