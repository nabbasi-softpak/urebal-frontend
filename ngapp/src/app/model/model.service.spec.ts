import {TestBed, inject, async} from '@angular/core/testing';
import { HttpClientModule} from '@angular/common/http';
import { URebalService } from '../services/urebal.service';
import { ModelService } from './model.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";

describe('ModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ModelService,
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

  it('ModelService should be truthy', inject([ModelService], (service: ModelService) => {
    expect(service).toBeTruthy();
  }));

  it('getModelsList should should return expected data', inject([HttpTestingController, ModelService],(httpMock: HttpTestingController,service: ModelService) => {
    //mock response to be expected from service
    const mockResponse = {
      "code":200,
      "message":null,
      "responsedata":[
        {
          "modelId":12298,
          "modelName":"PK_TEST_01",
          "elementsCount":10,
          "subModelsCount": 3,
          "assignedAccountsCount": 6,
          "cashTargetPctWt":"0.000",
          "modelType":"Security Model",
          "modelTypeNum":"1",
          "modelAttributeType":"N/A",
          "ticker":"DELL",
          "impartial":false,
          "priceZero":false
        },
        {
          "modelId":12301,
          "modelName":"QUIZMODEL1",
          "elementsCount":9,
          "subModelsCount": 5,
          "assignedAccountsCount": 0,
          "cashTargetPctWt":"0.000",
          "modelType":"Security Model",
          "modelTypeNum":"1",
          "modelAttributeType":"N/A",
          "ticker":"CONE",
          "impartial":false,
          "priceZero":false
        }
      ]
    };

    service.getModelsList().subscribe(res => {
      expect(res.code).toBe(200);
      expect(res.responsedata.length).toBeGreaterThan(0);
    });

    const mockReq = httpMock.expectOne(service.getServiceUrl() + "models");

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockResponse);

    httpMock.verify();
  }));
});
