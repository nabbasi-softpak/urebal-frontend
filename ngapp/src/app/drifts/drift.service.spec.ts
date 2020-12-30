import {TestBed, inject, async} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import { URebalService } from '../services/urebal.service';
import { DriftService } from './drift.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";

describe('DriftService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DriftService,
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

  it('Drift service should be truthy', inject([DriftService], (service: DriftService) => {
    expect(service).toBeTruthy();
  }));

  it('getDriftsList should return expected data', inject([HttpTestingController, DriftService],(httpMock: HttpTestingController,service: DriftService) => {
    //mock response to be expected from service
    const mockResponse = {
      "code": 200,
      "message": null,
      "responsedata": {
        "items":
          [
            {
              "portfolioId": 65,
              "portfolioName": "TEST-HH",
              "marketValue": 10727000,
              "sleeveCount": 2,
              "driftStatus": "Drifted",
              "asOfDate": "2017-08-10",
              "drift": 163.8554581896149
            },
            {
              "portfolioId": 701,
              "portfolioName": "YF_HOUSEHOLD",
              "marketValue": 3297468.9,
              "sleeveCount": 2,
              "driftStatus": "Drifted",
              "asOfDate": "2017-09-26",
              "drift": 173.1820308485814
            }
          ]
      }


    };
      let filter = false;

      service.getDriftsList(filter).subscribe(res => {
        expect(res.code).toBe(200);
        expect(res.responsedata.items.length).toBeGreaterThan(0);
      });

      const mockReq = httpMock.expectOne(service.getServiceUrl() + "portfolios/drifts");

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');

      mockReq.flush(mockResponse);

      httpMock.verify();
  }));

  it('getAttrType should return expected data', inject([HttpTestingController, DriftService],(httpMock: HttpTestingController,service: DriftService) => {
    //mock response to be expected from service
    const mockResponse = {
      "code": 200,
      "message": null,
      "responsedata": [
        {
          "attributeID": null,
          "attributeName": null,
          "attributeType": "11",
          "securities": []
        },
        {
          "attributeID": null,
          "attributeName": null,
          "attributeType": "123",
          "securities": []
        }
      ]
    };

    service.getAttrType().subscribe(res => {
      expect(res.code).toBe(200);
      expect(res.responsedata.length).toBeGreaterThan(0);
    });

    const mockReq = httpMock.expectOne(service.getServiceUrl() + "attributes/types");

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockResponse);

    httpMock.verify();
  }));

});
