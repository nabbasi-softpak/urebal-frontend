import {ComponentFixture, TestBed, inject} from "@angular/core/testing";
import {SecurityModelComponent} from "./security-model.component";
import {DebugElement, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import {ModelService} from "../model.service";
import {FormsModule} from "@angular/forms";
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule} from '../../shared/shared.module';
import {AppRoutingModule} from "../../app-routing.module";
import {DragulaModule} from "ng2-dragula";
import {DashboardComponent} from "../../dashboard/dashboard.component";
import {APP_BASE_HREF} from "@angular/common";
import {HistoryComponent} from "../../history/history.component";
import {DataImportComponent} from "../../settings/data-imports/data-import.component";
import {URebalService} from "../../services/urebal.service";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";
import {RedirectComponent} from "../../redirect/redirect.component";

describe('SecurityModelComponent', () => {
  let component: SecurityModelComponent;
  let fixture: ComponentFixture<SecurityModelComponent>;
  let debugElement: DebugElement;
  let htmlElement: HTMLElement;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        DataImportComponent,
        SecurityModelComponent,
        DashboardComponent,
        HistoryComponent,
        RedirectComponent
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        DragulaModule,
        AppRoutingModule,
        RouterTestingModule,
        SharedModule,
        LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
        })
      ],
      providers: [
        ModelService,
        URebalService,
        LocalStorageService,
        {provide: 'modelService', useClass: ModelService},
        {provide: APP_BASE_HREF, useValue : '/' }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    });
  });



  it('should create', inject([ModelService, RouterTestingModule],(modelService, router) => {
    fixture = TestBed.createComponent(SecurityModelComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  }));
});
