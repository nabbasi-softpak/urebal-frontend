import { async, inject, TestBed } from '@angular/core/testing';

import {HttpClientModule, HttpEvent, HttpEventType, HttpResponse, HttpXhrBackend} from "@angular/common/http";

import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from "@angular/router/testing"

import { SharelotReportComponent } from './sharelot-report.component';

import { SharedModule } from '../../../shared/shared.module'
import { URebalService } from '../../../services/urebal.service';
import { AccountService } from "../../../account/account.service";
import { WorkspaceService } from '../../../workspaces/workspace.service';

import {UrebalPermissions, PermissionResolverService} from '../../../services/permission-resolver.service';
import {IRequestOptions} from '../../../shared/classes/IRequestOptions.class';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {CustomResponse} from "../../../shared/classes/CustomResponse.class";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";


describe('SharelotReportComponent', () => {
  let component: SharelotReportComponent;
  let fixture;
  let debugElement;
  let htmlElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SharelotReportComponent],
      imports: [HttpClientModule, HttpClientTestingModule, FormsModule, RouterTestingModule, SharedModule, LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
      })],
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
    fixture = TestBed.createComponent(SharelotReportComponent);
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
    let expectedColumns = ['Account ID', 'Security ID', 'Action', 'Price (USD)', 'Trade Shares', 'Tax Cost Value (USD)', 'Round Trade Shares', 'Round Tax Cost Value (USD)', 'Basis Price (USD)', 'Purchase Date', 'Round Gain / Loss Value (USD)', 'Trade Value (USD)', 'Trade %', 'Init %', 'Proposed %', 'Init. Shares', 'Proposed Shares', 'Round Proposed Shares', 'Initial Value (USD)', 'Proposed Value (USD)', 'Round Trade Value (USD)', 'Round Trade %', 'Tax Rate %'];
    for (let column = 0; column < component.sharelotReportGrid.getColumns()['records'].length; column++) {
      columns.push(component.sharelotReportGrid.getColumns()['records'][column].text);
    }
    expect(columns).toEqual(expectedColumns);
  });

  it('Grid should contain expected columns properties', () => {

    let expectedColumns = [
      {
        'text': 'Account ID',
        'exportable': false,
        'datafield': 'accountId',
        'align': 'center',
        'cellsalign': 'left'
      },
      {
        'text': 'Security ID',
        'exportable': true,
        'datafield': 'ticker',
        'align': 'center',
        'cellsalign': 'left'
      },
      {
        'text': 'Action',
        'datafield': 'action',
        'exportable': true,
        'align': 'center',
        'cellsalign': 'left'
      },
      {
        'text': 'Price (USD)',
        'datafield': 'price',
        'exportable': false,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Trade Shares',
        'datafield': 'tradeShares',
        'exportable': false,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Tax Cost Value (USD)',
        'datafield': 'taxCostValue',
        'exportable': false,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Round Trade Shares',
        'datafield': 'roundTradeShares',
        'exportable': false,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Round Tax Cost Value (USD)',
        'datafield': 'roundTaxCostValue',
        'exportable': false,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Basis Price (USD)',
        'datafield': 'basisPrice',
        'exportable': true,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Purchase Date',
        'datafield': 'purchaseDate',
        'exportable': true,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Round Gain / Loss Value (USD)',
        'datafield': 'roundGainLossValue',
        'exportable': true,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Trade Value (USD)',
        'datafield': 'tradeValue',
        'exportable': false,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Trade %',
        'datafield': 'tradePercent',
        'exportable': true,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Init %',
        'datafield': 'initPercent',
        'exportable': true,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Proposed %',
        'datafield': 'optPctWt',
        'exportable': true,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Init. Shares',
        'datafield': 'initShares',
        'exportable': false,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Proposed Shares',
        'datafield': 'proposedShares',
        'exportable': false,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Round Proposed Shares',
        'datafield': 'roundOptShares',
        'exportable': false,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Initial Value (USD)',
        'datafield': 'initValue',
        'exportable': false,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Proposed Value (USD)',
        'datafield': 'optValue',
        'exportable': false,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Round Trade Value (USD)',
        'datafield': 'roundTradeValue',
        'exportable': false,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Round Trade %',
        'datafield': 'roundTradePercent',
        'exportable': false,
        'align': 'center',
        'cellsalign': 'right'
      },
      {
        'text': 'Tax Rate %',
        'datafield': 'taxRate',
        'exportable': true,
        'align': 'center',
        'cellsalign': 'right'
      }
    ];

    for (let column = 0; column < component.sharelotReportGrid.getColumns()['records'].length; column++) {
      let properties = Object.keys(expectedColumns[column]);
      for (let property = 0; property < properties.length; property++) {
        expect(component.sharelotReportGrid.getColumns()['records'][column][properties[property]]).toEqual(expectedColumns[column][properties[property]]);
      }

    }

  });

  it('Account Summary UI elements should contain given data', () => {

    let accountSummary = {
      "@id": 1,
      "portfolioId": 3855,
      "portfolioName": "HOUSE01",
      "isClone": false,
      "isHouseHold": true,
      "accounts":
        [
          {
            "@id": 2,
            "id": "KA_AUTO_A_EQL1_009",
            "accountName": "KA_AUTO_A_EQL1_009",
            "isTaxable": false,
            "marketValue": 3179390,
            "positions":
              [
                {
                  "accountPositionId":
                    {
                      "ticker": "YHOO"
                    },
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "AAON",
                    },
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "ABCD",
                    },
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "CBR"
                    },
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "CCU"
                    },
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "$CASH"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "BA"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "BAMM"
                    }
                }
              ]
          },
          {
            "@id": 3,
            "id": "KA_AUTO_A_EQL1_008",
            "accountName": "KA_AUTO_A_EQL1_008",
            "isTaxable": false,
            "marketValue": 3479390,
            "positions":
              [
                {
                  "accountPositionId":
                    {
                      "ticker": "BA"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "CBR"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "CCU"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "BAMM"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "YHOO"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "$CASH"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "AAON"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "ABCD"
                    }
                }
              ]
          },
          {
            "@id": 4, "id": "KA_AUTO_A_EQL1_007",
            "accountName": "KA_AUTO_A_EQL1_007",
            "isTaxable": true,
            "marketValue": 3179390,
            "positions":
              [
                {
                  "accountPositionId":
                    {
                      "ticker": "$CASH"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "BA"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "CBR"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "CCU"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "BAMM"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "YHOO"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "AAON"
                    }
                },
                {
                  "accountPositionId":
                    {
                      "ticker": "ABCD"
                    }
                }
              ]
          }
        ],
      "drift": 0,
      "marketValue": 9838170,
      "cashPercentage": 3.8784,
      "cash": 381563.585280,
      "freeCash": 50000,
      "freeCashPercentage": 0.5100,
      "positionsCount": 8,
      "isTaxable": false
    };

    component.accountSummary.accountDetail = accountSummary;

    fixture.detectChanges();

    expect(htmlElement.querySelector('span[id="account-title"]').innerHTML).toEqual(accountSummary.portfolioName);
    expect(htmlElement.querySelector('span[id="account-id"]').innerHTML).toEqual('N/A');
    expect(htmlElement.querySelector('span[id="account-type"]').innerHTML).toEqual('Household');
    expect(htmlElement.querySelector('span[id="account-mkv"]').innerHTML).toEqual('$' + accountSummary.marketValue.toFixed(0).replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,'));
    expect(htmlElement.querySelector('span[id="account-holdings"]').innerHTML).toBeLessThanOrEqual(accountSummary.positionsCount);
    expect(htmlElement.querySelector('span[id="account-freecash"]').innerHTML).toEqual('$' + accountSummary.freeCash.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
    expect(htmlElement.querySelector('span[id="account-corecash"]').innerHTML).toEqual('$' + accountSummary.cash.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));

  });

  it('AccountService should be truthy', inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));

});

describe('SharelotReportComponentService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SharelotReportComponent],
      imports: [HttpClientModule, HttpClientTestingModule, FormsModule, RouterTestingModule, SharedModule, LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
      })],
      providers: [
        URebalService,
        AccountService,
        WorkspaceService,
        UrebalPermissions,
        PermissionResolverService,
        LocalStorageService
      ]
    }).compileComponents();
  }));

  it('getSharelotLists should return expected data', inject([HttpTestingController, AccountService],(httpMock: HttpTestingController,service: AccountService) => {
    let portfolioId=222;
    //mock response to be expected from service
    const mockResponse = {
      "code":200,
      "message":null,
      "responsedata":
        [
          {
            "@id":1,
            "firmId":1,
            "portfolioId":537,
            "accountId":"QUA_AUTO_A_HHL1_002.1",
            "ticker":"$$$",
            "shareLotId":"C"
          },
          {
            "@id":2,
            "firmId":1,
            "portfolioId":537,
            "accountId":"QUA_AUTO_A_HHL1_002.1",
            "ticker":"AAPL",
            "shareLotId":"QUA_AUTO_A_HHL1_002.1_AAPL_1"
          },
          {
            "@id":3,"firmId":1,
            "portfolioId":537,
            "accountId":"QUA_AUTO_A_HHL1_002.1",
            "ticker":"ABCD",
            "shareLotId":"{BUY LOT}"
          },
          {
            "@id":4,
            "firmId":1,
            "portfolioId":537,
            "accountId":"QUA_AUTO_A_HHL1_002.1",
            "ticker":"AMAT"
            ,"shareLotId":"QUA_AUTO_A_HHL1_002.1_AMAT_1"
          },
          {
            "@id":5,
            "firmId":1,
            "portfolioId":537,
            "accountId":"QUA_AUTO_A_HHL1_002.1",
            "ticker":"BA",
            "shareLotId":"{BUY LOT}"
          },
          {
            "@id":6,
            "firmId":1,
            "portfolioId":537,
            "accountId":"QUA_AUTO_A_HHL1_002.1",
            "ticker":"BABA",
            "shareLotId":"QUA_AUTO_A_HHL1_002.1_BABA_1"
          }
        ]
    };

    service.get("sharelot/getShareLotsListId/" + portfolioId).subscribe(res => {
      expect(res.code).toBe(200);
      expect(res.responsedata.length).toBeGreaterThan(0);
    });

    const mockReq = httpMock.expectOne(service.getServiceUrl() + "sharelot/getShareLotsListId/" + portfolioId);

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockResponse);

    httpMock.verify();
  }));

});
