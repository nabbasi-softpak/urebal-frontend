/*
import {CreateWorkspaceComponent} from "./create-workspace.component";
import {WorkspaceService} from "../workspace.service";
import {Observable, of} from "rxjs";
import {CriteriaService} from "../components/criteria-builder/criteria.service";
import {CriteriaBuilderComponent} from "../components/criteria-builder/criteria-builder.component";
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {ActivatedRoute, Router} from "@angular/router";

class MockWorkspaceService extends WorkspaceService {

  workspaceResponse:any;
  workspaceRebalanceResponse:any;

  constructor() {
    super(null);
  }

  getWorkspace(workspaceName) {
    return of(this.workspaceResponse);
  }

  getRebalanceListByCriteria(workspaceCriteria,isWorkspace) {
    return of(this.workspaceRebalanceResponse);
  }

  saveWorkspace(workspace) {
    return of(this.workspaceResponse);
  }
}

class MockCriteriaService extends CriteriaService{
  constructor() {
    super(null);
  }
}

describe('CreateWorkspaceComponent', () => {

  let createWorkspaceComponent: CreateWorkspaceComponent;
  let modalComponent: ModalComponent;
  let mockWorkspaceService;

  beforeEach(() => {
    mockWorkspaceService = new MockWorkspaceService();
    let criteriaService = new MockCriteriaService();
    let route = new ActivatedRoute();
    let router: Router;

    router = jasmine.createSpyObj("Router", ['navigate']);

    createWorkspaceComponent = new CreateWorkspaceComponent(mockWorkspaceService,criteriaService,route, router);

    //createWorkspaceComponent.criteriaBuilder = CriteriaBuilderComponent;

    modalComponent = new ModalComponent();

  });

  it('Get Workspace Already Exist', () => {
    mockWorkspaceService.workspaceResponse = {
        code: 200,
        message: null,
        responsedata: {workflowId:65,name:'TestData'}
    };
    createWorkspaceComponent.workspaceName = "Dummy Workflow";
    createWorkspaceComponent.getWorkspace();
    expect(createWorkspaceComponent.invalidWorkspaceName).toBe(true);
    expect(createWorkspaceComponent.workspaceErrorMessage).toBe("Workspace already exist");
    console.log("(workspace Already Exist) Fetch workspace:"+createWorkspaceComponent.workspaceName);
  });

  it('Get workspace in Edit case', () => {
    mockWorkspaceService.workspaceResponse = {
      code: 200,
      message: null,
      responsedata: {workflowId:65,name:'TestData',criteriaString:"Account Name = 'ACCOUNTAA'"}
    };
    createWorkspaceComponent.isEdit = true;
    createWorkspaceComponent.workspaceName = "Dummy Workflow";
    createWorkspaceComponent.getWorkspace();
    expect(createWorkspaceComponent.invalidWorkspaceName).toBe(false);
    expect(createWorkspaceComponent.workspaceErrorMessage).toBeUndefined();
    expect(createWorkspaceComponent.userCriteria).toBe(mockWorkspaceService.workspaceResponse.responsedata.criteriaString);
    console.log("(workspace Already Exist) Fetch workspace:"+createWorkspaceComponent.workspaceName);
  });


  it('Get New workspace', () => {
    mockWorkspaceService.workspaceResponse = {
      code: 0,
      message: null,
      responsedata: null
    };
    createWorkspaceComponent.workspaceName = "NEW_WORKFLOW";
    createWorkspaceComponent.getWorkspace();
    expect(createWorkspaceComponent.invalidWorkspaceName).toBe(false);
    expect(createWorkspaceComponent.workspaceErrorMessage).toBeUndefined();
    console.log('(workspace Already Exist) Fetch workspace:' + createWorkspaceComponent.workspaceName);
  });

  it('Get workspace with empty workspace name', () => {
    createWorkspaceComponent.getWorkspace();
    expect(createWorkspaceComponent.invalidWorkspaceName).toBe(true);
    expect(createWorkspaceComponent.workspaceErrorMessage).toBe("Please enter valid workspace name");
    console.log("(Get workspace with empty workspace name) Fetch workspace:"+createWorkspaceComponent.workspaceName);
  });

  /!*it('Get workspace rebalances', () => {
    mockWorkspaceService.workspaceRebalanceResponse = {
      code: 200,
      message: null,
      responsedata: [{rebalanceId:1,portfolioId:1,portfolioName:"ACCOUNTAA"}]
    };
    createWorkspaceComponent.userCriteria = "Account Name = 'ACCOUNTAA'";
    criteriaBuilder.isWorkspaceExists = true;
    //createWorkspaceComponent.isWorkspace = true;
    createWorkspaceComponent.getRebalanceListByCriteria();
    expect(createWorkspaceComponent.gridCriteriaData.length).toBeGreaterThanOrEqual(1);
    expect(createWorkspaceComponent.isStep1).toBe(false);
    expect(createWorkspaceComponent.invalidWorkspace).toBe(false);
    console.log("Get workspace rebalances");
  }));

  it('Get workspace rebalances with invalid criteria', () => {
    mockWorkspaceService.workspaceRebalanceResponse = {
      code: 0,
      message: null,
      responsedata: null
    };
    createWorkspaceComponent.userCriteria = " ";
    createWorkspaceComponent.getRebalanceListByCriteria();
    expect(createWorkspaceComponent.gridCriteriaData.length).toBe(0);
    expect(createWorkspaceComponent.isStep1).toBe(true);
    expect(createWorkspaceComponent.invalidWorkspace).toBe(true);
    expect(createWorkspaceComponent.workspaceErrorMessage).toBe("No results found on the given criteria, please enter another criteria");
    console.log("Get workspace rebalances with invalid criteria");
  });*!/

  /!*it('Save workspace', () => {
    mockWorkspaceService.workspaceResponse = {
      code: 200,
      message: null,
      responsedata: null
    };
    modalComponent.id = "saveworkspaceModal";
    createWorkspaceComponent.saveWorkspaceModal = modalComponent;
    createWorkspaceComponent.selectedRebalanceData = [{rebalanceId:1,portfolioId:1,portfolioName:"ACCOUNTAA"}];
    createWorkspaceComponent.saveWorkspace();
    expect(createWorkspaceComponent.invalidWorkspace).toBe(false);
    expect(createWorkspaceComponent.workspaceSuccessMessage).toBe("Workspace '"+createWorkspaceComponent.workspaceName+"' saved successfully");
    expect(createWorkspaceComponent.workspaceErrorMessage).toBeUndefined();
    console.log("Save workspace");
  });*!/

  it('Save workspace with no rebalance selected', () => {
    createWorkspaceComponent.selectedRebalanceData = [];
    createWorkspaceComponent.saveWorkspace();
    expect(createWorkspaceComponent.invalidWorkspace).toBe(true);
    expect(createWorkspaceComponent.workspaceErrorMessage).toBe("Please select projects to save workspace");
    expect(createWorkspaceComponent.workspaceSuccessMessage).toBeUndefined();
    console.log("Save workspace with no rebalance selected");
  });

  it('Save workspace fail', () => {
    mockWorkspaceService.workspaceResponse = {
      code: 400,
      message: "Workspace save failed",
      responsedata: null
    };
    createWorkspaceComponent.selectedRebalanceData = [{rebalanceId: 1, portfolioId: 1, portfolioName: "ACCOUNTAA"}];
    createWorkspaceComponent.saveWorkspace();
    expect(createWorkspaceComponent.invalidWorkspace).toBe(true);
    expect(createWorkspaceComponent.workspaceErrorMessage).toBe("Workspace save failed");
    expect(createWorkspaceComponent.workspaceSuccessMessage).toBeUndefined();
    console.log("Save workspace fail");
  });

});
*/
