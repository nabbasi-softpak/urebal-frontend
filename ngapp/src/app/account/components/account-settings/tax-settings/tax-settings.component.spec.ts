import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { ToggleButtonComponent } from '../../../../shared/components/toggle-button/toggle-button.component'
import { TaxSettingsComponent } from './tax-settings.component';
import { AccountService } from '../../../account.service';
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";


describe('TaxSettingsComponent', () => {
  let component;
  let fixture;
  let debugElement;
  let htmlElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxSettingsComponent, ToggleButtonComponent ],
      imports: [FormsModule, HttpClientModule, LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
      })],
      providers: [AccountService, LocalStorageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxSettingsComponent);
    component = fixture.componentInstance;
    //The DebugElement associated with the root element of this component.
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create account tax settings component', () => {
    expect(component).toBeTruthy();
  });

  it('Element should reflect data binding value', () => {
    let response = {
      "code":200,
      "message":"Account is fetched.",
      "responsedata":[
        {
          "id":"48-1239",
          "isTaxable":true,
          "ltTaxRate":20.0000,
          "stTaxRate":39.6000,
          "donotSellStl":false,
          "donotSellLtl":false,
          "donotSellStg":false,
          "donotSellLtg":false,
          "donotSellConvertibleStg":false,
          "rollOverPeriod":30,
          "isMcgSlSeparation":true,
          "ytdNetGainLoss":0.000000,
          "ytdStGainLoss":0.000000,
          "ytdLtGainLoss":0.000000,
          "maxCapitalGainType":"DOLLAR",
          "maxCapitalGain":1000000000.000000,
          "maxCapitalGainSt":1000000000.000000,
          "maxCapitalGainLt":1000000000.000000,
        }
      ]
    };
    component.accountSettings = response.responsedata[0];
    fixture.detectChanges();

    expect($('input[name=checkbox]').val()).toEqual('on');

    $('div.toggle-isMcgSlSeparation button').each((i, btn) => {
      if($(btn).hasClass('slds-button-active')) {
        expect($(btn).text()).toEqual('S/L Term Separation');
      } else {
        expect($(btn).text()).toEqual('Net');
      }
    })

    $('div.toggle-donotSellLtl button').each((i, btn) => {
      if($(btn).hasClass('slds-button-active')) {
        expect($(btn).text()).toEqual('Sell');
      } else {
        expect($(btn).text()).toEqual('Don\'t Sell');
      }
    })

    $('div.toggle-donotSellStl button').each((i, btn) => {
      if($(btn).hasClass('slds-button-active')) {
        expect($(btn).text()).toEqual('Sell');
      } else {
        expect($(btn).text()).toEqual('Don\'t Sell');
      }
    })

    $('div.toggle-donotSellLtg button').each((i, btn) => {
      if($(btn).hasClass('slds-button-active')) {
        expect($(btn).text()).toEqual('Sell');
      } else {
        expect($(btn).text()).toEqual('Don\'t Sell');
      }
    })

    $('div.toggle-donotSellStg button').each((i, btn) => {
      if($(btn).hasClass('slds-button-active')) {
        expect($(btn).text()).toEqual('Sell');
      } else {
        expect($(btn).text()).toEqual('Don\'t Sell');
      }
    })

    $('div.toggle-donotSellConvertibleStg button').each((i, btn) => {
      if($(btn).hasClass('slds-button-active')) {
        expect($(btn).text()).toEqual('Sell');
      } else {
        expect($(btn).text()).toEqual('Don\'t Sell');
      }
    })

  });

});
