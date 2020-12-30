import {TestBed, async } from '@angular/core/testing';
import { RouterTestingModule} from '@angular/router/testing';
import {LocalStorageModule, LocalStorageService} from 'angular-2-local-storage';

import { URebalService } from './services/urebal.service';
import {UserService} from './user/user.service';

import { AppComponent } from './app.component';
import { BlockUIModule } from 'ng-block-ui';
import {SharedModule} from './shared/shared.module';
import {ErrorLogService} from "./error-log.service";

import {UrebalPermissions, PermissionResolverService} from './services/permission-resolver.service';
import {HttpClient, HttpClientModule} from "@angular/common/http";

class MockRouter {
    navigateByUrl(url: string) { return url; }
}

class MockLocalStorageService {

}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BlockUIModule.forRoot(),
        RouterTestingModule,
        SharedModule,
        HttpClientModule,
        LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
        })
      ],
      providers: [
        {provide: LocalStorageService, useclass: MockLocalStorageService},
        URebalService,
        UserService,
        ErrorLogService,
        PermissionResolverService,
        UrebalPermissions,
        LocalStorageService
      ]
    }).compileComponents();
  }));

  it('should create app component', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
