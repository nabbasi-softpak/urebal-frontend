import { async, inject, TestBed } from '@angular/core/testing';

import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from "@angular/router/testing"

import { StockReportComponent } from './stock-report.component';

import { SharedModule } from '../../../shared/shared.module'
import { URebalService } from '../../../services/urebal.service';
import { AccountService } from "../../../account/account.service";
import { WorkspaceService } from '../../../workspaces/workspace.service';

import {UrebalPermissions, PermissionResolverService} from '../../../services/permission-resolver.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";

describe('StockReportComponent', () => {
  let component: StockReportComponent;
  let fixture;
  let debugElement;
  let htmlElement;
  let portfolioId=481;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReportComponent ],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule,
        SharedModule,
        LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
        })
      ],
      providers: [
        URebalService,
        AccountService,
        WorkspaceService,
        UrebalPermissions,
        PermissionResolverService,
        LocalStorageService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReportComponent);
    component = fixture.componentInstance;
    //The DebugElement associated with the root element of this component.
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Grid should contain expected columns', () => {
    let columns = [];
    let expectedColumns = ['Security ID', 'Attribute Name', 'Equivalence Name', 'Security Type', 'Action', 'Price (USD)', 'Trade Shares', 'Round Trade Shares', 'Trade Dollar (USD)', 'Trade %', 'Init %', 'Target %', 'Min %', 'Max %', 'Adjusted Target %', 'Adjusted Min %', 'Adjusted Max %', 'Proposed %', 'Init. Shares', 'Target Shares', 'Proposed Shares', 'Init. Dollar (USD)', 'Target Dollar (USD)', 'Proposed Dollar (USD)', 'Round Trade Dollar (USD)', 'Round Trade %', 'Adjusted Target Shares', 'Adjusted Target Dollar (USD)'];
    for (let column = 0; column < component.stockReportGrid.getColumns()['records'].length; column++) {
      columns.push(component.stockReportGrid.getColumns()['records'][column].text);
    }
    expect(columns).toEqual(expectedColumns);
  });

  it('Grid should contain expected columns properties', () => {

    let expectedColumns = [
      {
        'text':'Security ID',
        'exportable':true,
        'datafield':'ticker',
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Attribute Name',
        'exportable':false,
        'datafield':'attributeList',
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Equivalence Name',
        'datafield':'equivalenceName',
        'exportable':false,
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Security Type',
        'datafield':'securityType',
        'exportable':false,
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Action',
        'datafield':'tradeType',
        'exportable':true,
        'align':'center',
        'cellsalign':'left'
      },
      {
        'text':'Price (USD)',
        'datafield':'price',
        'exportable':true,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Trade Shares',
        'datafield':'tradeShares',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Round Trade Shares',
        'datafield':'roundTradeShares',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Trade Dollar (USD)',
        'datafield':'tradeValue',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Trade %',
        'datafield':'tradePct',
        'exportable':true,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Init %',
        'datafield':'initPct',
        'exportable':true,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Target %',
        'datafield':'modelTargetPct',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Min %',
        'datafield':'modelMinPct',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Max %',
        'datafield':'modelMaxPct',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Adjusted Target %',
        'datafield':'adjustedTargetPct',
        'exportable':true,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Adjusted Min %',
        'datafield':'adjustedMinPct',
        'exportable':true,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Adjusted Max %',
        'datafield':'adjustedMaxPct',
        'exportable':true,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Proposed %',
        'datafield':'optPct',
        'exportable':true,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Init. Shares',
        'datafield':'initShares',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Target Shares',
        'datafield':'targetShares',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Proposed Shares',
        'datafield':'optShares',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Init. Dollar (USD)',
        'datafield':'initValue',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Target Dollar (USD)',
        'datafield':'targetValue',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Proposed Dollar (USD)',
        'datafield':'optValue',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Round Trade Dollar (USD)',
        'datafield':'roundTradeValue',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Round Trade %',
        'datafield':'roundTradePct',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Adjusted Target Shares',
        'datafield':'adjustedTargetShares',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      },
      {
        'text':'Adjusted Target Dollar (USD)',
        'datafield':'adjustedTargetValue',
        'exportable':false,
        'align':'center',
        'cellsalign':'right'
      }
    ];

    for (let column = 0; column < component.stockReportGrid.getColumns().length; column++) {
      let properties = Object.keys(expectedColumns[column]);
      for (let property = 0; property < properties.length; property++) {
        expect(component.stockReportGrid.getColumns()[column][properties[property]]).toEqual(expectedColumns[column][properties[property]]);
      }

    }

  });

  it('AccountService should be truthy', inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));
});


xdescribe('StockReportComponentService', () => {
  let component: StockReportComponent;
  let fixture;
  let debugElement;
  let htmlElement;
  let portfolioId=481;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReportComponent ],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule,
        SharedModule
      ],
      providers: [
        URebalService,
        AccountService,
        WorkspaceService,
        UrebalPermissions,
        PermissionResolverService,
      ]
    })
      .compileComponents();
  }));

  it('Get stock by portfolio id should return expected data', inject([HttpTestingController, AccountService],(httpMock: HttpTestingController,service: AccountService) => {
    //mock response to be expected from service
    const mockResponse =
      {
        "code":200,
        "message":null,
        "responsedata":
          [
            {
              "accountId":"Account-Test","ticker":"$$$","portfolioId":481,"firmId":1,"tradeType":"Cash","securityType":"CASH","price":100
            },
            {
              "accountId":"Account-Test","ticker":"A","portfolioId":481,"firmId":1,"tradeType":"Buy","securityType":"Equity","price":5
            },
            {
              "accountId":"Account-Test","ticker":"BABA","portfolioId":481,"firmId":1,"tradeType":"Sell","securityType":"Equity","price":143.81
            },
            {
              "accountId":"Account-Test","ticker":"BP","portfolioId":481,"firmId":1,"tradeType":"Sell","securityType":"Equity","price":34.33
            },
            {
              "accountId":"Account-Test","ticker":"DELL","portfolioId":481,"firmId":1,"tradeType":"Sell","securityType":"Equity","price":94
            }
          ]
      };
    //service call to verify correct reponse returned from service as expected
    service.get("portfolios/"+portfolioId + "/reports/overlay-stock?sort=ticker:asc").subscribe(res => {
      expect(res.code).toBe(200);
      expect(res.responsedata.length).toBeGreaterThan(0);
    });

    const mockReq = httpMock.expectOne(service.getServiceUrl() + "portfolios/"+portfolioId + "/reports/overlay-stock?sort=ticker:asc");

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockResponse);

    httpMock.verify();

  }));


  it('Get overlay stock by portfolio id should return expected data', inject([HttpTestingController, AccountService],(httpMock: HttpTestingController,service: AccountService) => {
    //mock response to be expected from service
    const mockResponse =
      {
        "code":200,
        "message":null,
        "responsedata":
          [
            {
              "@id":1,"firmId":1,"portfolioId":6211,"ticker":"$$$","price":100,"tradeShares":20000,"tradeValue":2000000,"tradeType":"Cash"
            },
            {
              "@id":2,"firmId":1,"portfolioId":6211,"ticker":"AAPL","price":145.06,"tradeShares":18650,"tradeValue":2705369,"tradeType":"Sell"
            },
            {
              "@id":3,"firmId":1,"portfolioId":6211,"ticker":"ABCD","price":4.99,"tradeShares":1425998.01523,"tradeValue":7115730.096,"tradeType":"Buy"
            },
            {
              "@id":4,"firmId":1,"portfolioId":6211,"ticker":"AMAT","price":44.21,"tradeShares":105000,"tradeValue":4642050,"tradeType":"Sell"
            },
            {
              "@id":5,"firmId":1,"portfolioId":6211,"ticker":"BA","price":203.96,"tradeShares":34887.870642,"tradeValue":7115730.096,"tradeType":"Buy"
            },
            {
              "@id":6,"firmId":1,"portfolioId":6211,"ticker":"BABA","price":143.81,"tradeShares":50000,"tradeValue":7190500,"tradeType":"Sell"
            },
            {
              "@id":7,"firmId":1,"portfolioId":6211,"ticker":"BEAT","price":32.15,"tradeShares":152000,"tradeValue":4886800,"tradeType":"Sell"
            },
            {
              "@id":8,"firmId":1,"portfolioId":6211,"ticker":"CBR","price":4.58,"tradeShares":1503673.601746,"tradeValue":6886825.096,"tradeType":"Buy"
            },
            {
              "@id":9,"firmId":1,"portfolioId":6211,"ticker":"CCU","attributeList":"","price":26.04,"tradePct":20,"tradeShares":273261.524424,"roundTradeShares":273259,"comments":null,"tradeValue":7115730.096,"tradeType":"Buy","initPct":0,"modelTargetPct":20,"roundOptPct":19.999815,"optPct":20,"initShares":0,"initValue":0,"targetShares":273261.524424,"targetValue":7115730.096,"roundOptShares":273259,"optShares":273261.524424,"roundOptValue":7115664.36,"optValue":7115730.096,"roundTradePct":19.999815,"roundTradeValue":7115664.36,"adjustedTargetShares":273261.524424,"adjustedTargetValue":7115730.096,"adjustedTargetPct":20,"roundBuyPct":19.999815,"roundSellPct":0,"buyPct":20,"sellPct":0,"roundBuyShares":273259,"roundSellShares":0,"buyShares":273261.524424,"sellShares":0,"roundBuyValue":7115664.36,"roundSellValue":0,"buyValue":7115730.096,"sellValue":0,"modelMinPct":18,"modelMaxPct":22,"adjustedMinPct":18,"adjustedMaxPct":22,"equivalenceName":"","securityType":"Equity","asOfDate":1519901978000
            }
          ]
      };
    let portfolioId = 6211;


    service.get("portfolios/"+portfolioId + "/reports/overlay-stock?sort=ticker:asc").subscribe(res => {
      expect(res.code).toBe(200);
      expect(res.responsedata.length).toBeGreaterThan(0);
    });

    const mockReq = httpMock.expectOne(service.getServiceUrl() + "portfolios/"+portfolioId + "/reports/overlay-stock?sort=ticker:asc");

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockResponse);

    httpMock.verify();
  }));

});
