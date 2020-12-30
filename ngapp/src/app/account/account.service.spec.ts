import { TestBed, inject } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import { URebalService } from '../services/urebal.service';
import { AccountService } from './account.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";

describe('AccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountService,
        URebalService,
        LocalStorageService
      ],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
        })
      ]
    });
  });

  it('AccountService should be truthy', inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));

  it('getPortfoliosList should should return expected data', inject([HttpTestingController, AccountService],(httpMock: HttpTestingController,service: AccountService) => {
    //mock response to be expected from service
    const mockResponse = {
      code: 200,
      message: null,
      responsedata: [
        {
          accounts: ["AK_ACC_2", "JK_ACC_REBALANCE1"],
          clone: false,
          drift: 0,
          houseHold: true,
          portfolioId: 65,
          portfolioName: "TEST-HH",
          taxable: "Mixed",
          marketValue: 33081525.92,
          positionsCount: 5,
          totalFreeCashPercentage: 0.6,
          totalFreeCash: 200000,
          totalCashPercentage: 0,
          totalCash: 0
        },
        {
          accounts:["48-1240", "YF_AR_1"],
          clone:false,
          drift:0,
          houseHold:true,
          portfolioId:701,
          portfolioName:"YF_HOUSEHOLD",
          taxable:"Yes",
          marketValue: 33081525.92,
          positionsCount: 5,
          totalFreeCashPercentage: 0.6,
          totalFreeCash: 200000,
          totalCashPercentage: 0,
          totalCash: 0
        }
      ]
    };

    service.getPortfoliosList().subscribe(res => {
      expect(res.code).toBe(200);
      expect(res.responsedata.length).toBeGreaterThan(0);
    });

    const mockReq = httpMock.expectOne(service.getServiceUrl() + service.GET_PORTFOLIOS);

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockResponse);

    httpMock.verify();
  }));

  it('getPortfolio by name should return expected data', inject([HttpTestingController, AccountService],(httpMock: HttpTestingController,service: AccountService) => {
    //mock response to be expected from service
    const mockResponse = {
      "code": 200,
      "message": "OK",
      "responsedata": {
        "@id": 1,
        "portfolioId": 701,
        "portfolioName": "YF_HOUSEHOLD",
        "accounts": [
          {
            "@id": 2,
            "id": "48-1240",
            "accountName": "48-1240",
          },
          {
            "@id": 3,
            "id": "YF_AR_1",
            "accountName": "YF_AR_1",
          }
        ]
      }
    };
    let id = 'YF_HOUSEHOLD';

    // service.getPortfolioByName(id).subscribe(res => {
    //   expect(res.code).toBe(200);
    // });
    //
    // const mockReq = httpMock.expectOne({
    //   method: 'POST',
    //   url: service.getServiceUrl() + service.GET_PORTFOLIO_BY_NAME
    // });

    // expect(mockReq.request.body).toEqual(id);
    // expect(mockReq.cancelled).toBeFalsy();
    // expect(mockReq.request.responseType).toEqual('json');
    //
    // mockReq.flush(mockResponse);
    //
    // httpMock.verify();
  }));

  xit('get positions should return expected data', inject([HttpTestingController, AccountService],(httpMock: HttpTestingController,service: AccountService) => {
    //mock response to be expected from service
    const mockResponse = {
      "code":200,
      "message":null,
      "responsedata":[
        {
          "ticker":"JBL",
          "accountId":"48-1240",
          "shareLotId":"48-1240_JBL_1",
          "shares":7000,
          "isTradeable":true,
          "basisPrice":18,
          "buyDate":"2016-12-07",
          "tradeableShares":null
        },
        {
          "ticker":"YHOO",
          "accountId":"48-1240",
          "shareLotId":"48-1240_YHOO_1",
          "shares":1750,
          "isTradeable":true,
          "basisPrice":35.9,
          "buyDate":"2016-12-07",
          "tradeableShares":null
        },
        {
          "ticker":"NVDA",
          "accountId":"48-1240",
          "shareLotId":"48-1240_NVDA_1",
          "shares":6500,
          "isTradeable":true,
          "basisPrice":17.91,
          "buyDate":"2016-12-07",
          "tradeableShares":null
        },
        {
          "ticker":"ADBE",
          "accountId":"48-1240",
          "shareLotId":"48-1240_ADBE_1",
          "shares":1500,
          "isTradeable":true,
          "basisPrice":65.74,
          "buyDate":"2016-12-07",
          "tradeableShares":null
        }
      ]
    };
    let id = '48-1240';

    service.getPositions(id).subscribe(res => {
      expect(res.code).toBe(200);
      expect(res.responsedata.length).toBeGreaterThan(0);
    });

    const mockReq = httpMock.expectOne(service.getServiceUrl() + service.getPositions(id) );

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockResponse);

    httpMock.verify();
  }));

  xit('get washsales should return expected data', inject([HttpTestingController, AccountService],(httpMock: HttpTestingController,service: AccountService) => {
    //mock response to be expected from service
    const mockResponse = {
      "code":200,
      "message":null,
      "responsedata":[
        {
          "accountId":"YF_AR_1",
          "ticker":"AVGO",
          "sellDate":"2017-05-29",
          "asOfDate":1501069767000,
          "dateInString":"05/29/2017"
        },
        {
          "accountId":"YF_AR_1",
          "ticker":"LOGI",
          "sellDate":"2017-05-29",
          "asOfDate":1501069787000,
          "dateInString":"05/29/2017"
        },
        {
          "accountId":"YF_AR_1",
          "ticker":"YHOO",
          "sellDate":"2017-05-29",
          "asOfDate":1501069788000,
          "dateInString":"05/29/2017"
        },
        {
          "accountId":"YF_AR_1",
          "ticker":"ARTNA",
          "sellDate":"2017-05-29",
          "asOfDate":1501069788000,
          "dateInString":"05/29/2017"
        },
        {
          "accountId":"YF_AR_1",
          "ticker":"PLUS",
          "sellDate":"2017-05-29",
          "asOfDate":1501069805000,
          "dateInString":"05/29/2017"
        }
      ]
    };
    let id = '48-1240';

    service.getWashSales(id).subscribe(res => {
      expect(res.code).toBe(200);
      expect(res.responsedata.length).toBeGreaterThan(0);
    });

    const mockReq = httpMock.expectOne(service.getServiceUrl() + service.getWashSales(id));

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockResponse);

    httpMock.verify();

  }));

  xit('get account tax settings should return expected data', inject([HttpTestingController, AccountService],(httpMock: HttpTestingController,service: AccountService) => {
    //mock response to be expected from service
    const mockResponse = {
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
    let data = {"id": "48-1239"};

    service.getAccountSetting(data).subscribe(res => {
      expect(res.code).toBe(200);
      expect(res.responsedata[0].isTaxable).toBeTruthy();
      expect(res.responsedata[0].isMcgSlSeparation).toBeTruthy();
      expect(res.responsedata[0].maxCapitalGainType).toEqual('DOLLAR');
    });

    const mockReq = httpMock.expectOne( {
      method: 'POST',
      url: service.getServiceUrl() + service.GET_ACCOUNT_SETTINGS,
    });

    expect(mockReq.request.body).toEqual(data);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockResponse);

    httpMock.verify();
  }));

  xit('get account restrictions should return expected data', inject([HttpTestingController, AccountService],(httpMock: HttpTestingController,service: AccountService) => {
    //mock response to be expected from service
    const mockResponse = {
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
    let id = "AK_ACC_2";

    service.getRestriction(1,id).subscribe(res => {
      expect(res.code).toBe(200);
      expect(res.responsedata.length).toBeGreaterThan(1);
    });

    const mockReq = httpMock.expectOne(service.getServiceUrl() + service.getRestriction(1,id));

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockResponse);

    httpMock.verify();
  }));

  xit('save account restrictions should return expected data',inject([HttpTestingController, AccountService],(httpMock: HttpTestingController,service: AccountService) => {
    //mock response to be expected from service
    const mockRequest = [
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
      ];
    let mockResponse = {"code":200,"message":"Restrictions applied successfully.","responsedata":null};
    //create mock response to be returned from service
    let id = "AK_ACC_2";

    service.saveRestrictions(id, mockRequest).subscribe(res => {
      expect(res.code).toBe(200);
      expect(res.responsedata).toBeNull();
      expect(res.message).toEqual('Restrictions applied successfully.');
    });

    const mockReq = httpMock.expectOne( {
      method: 'PUT',
    });

    expect(mockReq.request.body).toEqual(mockRequest);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockResponse);

    httpMock.verify();
  }));

  it('get account attributes restrictions should return expected data', inject([HttpTestingController, AccountService],(httpMock: HttpTestingController,service: AccountService) => {
    //mock response to be expected from service
    const mockResponse = {
      "code":200,
      "message":null,
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
    let id = "AK_ACC_2";

    service.getAccountAttributes(id).subscribe(res => {
      expect(res.code).toBe(200);
      expect(res.responsedata.length).toBeGreaterThan(1);
    });

    const mockReq = httpMock.expectOne(service.getServiceUrl() + service.GET_ACCOUNT_ATTRIBUTES + id);

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockResponse);

    httpMock.verify();
  }));

  it('save account attribute restrictions should return expected data', inject([HttpTestingController, AccountService],(httpMock: HttpTestingController,service: AccountService) => {
    //mock response to be expected from service
    const mockRequest = [
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
    ];
    let mockResponse = {"code":200,"message":"Saved Successfully.","responsedata":null};

    service.saveAccountAttributes(mockRequest).subscribe(res => {
      expect(res.code).toBe(200);
      expect(res.responsedata).toBeNull();
      expect(res.message).toEqual('Saved Successfully.');
    });

    const mockReq = httpMock.expectOne( {
      method: 'PUT',
      url: service.getServiceUrl() + service.SAVE_ACCOUNT_ATTRIBUTE,
    });

    expect(mockReq.request.body).toEqual(mockRequest);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockResponse);

    httpMock.verify();

  }));
});
