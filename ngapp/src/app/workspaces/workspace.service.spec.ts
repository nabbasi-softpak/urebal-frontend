import {TestBed, inject, async} from '@angular/core/testing';
import { WorkspaceService } from './workspace.service';
import {HttpClientModule}  from '@angular/common/http'
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";

describe('WorkspaceService', () => {

  let workspaceResponse:any={
    code: 200,
    message: null,
    responsedata: null
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
        })
      ],
      providers: [
        WorkspaceService,
        LocalStorageService
      ],
    });
  }));


  it('#getWorkspace should call endpoint and return it\'s result', inject([HttpTestingController, WorkspaceService],(httpMock: HttpTestingController,service: WorkspaceService) => {
    let workspaceName = 'Dummy Workflow';
    service.getWorkspace(workspaceName).subscribe(res => {
      expect(res).toEqual({
        code: 200,
        message: null,
        responsedata: null
      });
    });

    const mockReq = httpMock.expectOne(service.getServiceUrl() + service.GET_WORKFLOW + "?workflowName=" + encodeURIComponent(workspaceName));

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(workspaceResponse);

    httpMock.verify();
  }));


  it('getWorkspaceList should should return expected data',  inject([HttpTestingController, WorkspaceService],(httpMock: HttpTestingController,service: WorkspaceService) => {
    //mock response to be expected from service
    const mockResponse = {
      code: 200,
      message: null,
      responsedata: [
        {
          asOfDate: '2018-01-31',
          criteriaString: 'Taxable = false',
          name: 'MUSTAFA-TEST',
          rebalanceCount: 6,
          rebalanceStatus: 'Partial Success',
          totalAccounts: 5,
          totalHouseholds: 0,
          totalMktVal: 8502620,
          type: 'Static',
          workflowId: 24
        },
        {
          asOfDate: '2018-01-08',
          criteriaString: 'Portfolio Market Value > 0',
          name: 'REBALANCE-TEST',
          rebalanceCount: 17,
          rebalanceStatus: 'Success',
          totalAccounts: 17,
          totalHouseholds: 3,
          totalMktVal: 35393089.7618,
          type: 'Static',
          workflowId: 71
        }

      ]
    };

    //service call to verify correct reponse returned from service as expected
    service.getWorkspaceList().subscribe(res => {
      expect(res.code).toBe(200);
      expect(res.responsedata.length).toBeGreaterThan(0);
    });

    const mockReq = httpMock.expectOne(service.getServiceUrl() + service.GET_WORKFLOWLIST);

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(mockResponse);

    httpMock.verify();
  }));

});
