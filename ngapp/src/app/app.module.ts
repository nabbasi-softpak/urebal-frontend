import {NgModule, APP_INITIALIZER} from '@angular/core';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BlockUIModule} from 'ng-block-ui';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {UserModule} from './user/user.module';
import {AppRoutingModule} from './app-routing.module';
import {URebalService} from './services/urebal.service';
import {AuthGuardService} from './services/auth-guard.service';
import {AppComponent} from './app.component';
import {DataImportService} from "./settings/data-imports/data-import.service";
import {ErrorLogService} from './error-log.service';
import {AppConfig} from '../app.config'
import {PermissionResolverService, UrebalPermissions} from './services/permission-resolver.service';
import {UserService} from "./user/user.service";
import {DragulaModule} from "ng2-dragula";
import * as $ from 'jquery'; // Need to include jquery globally.
import {RedirectComponent} from './redirect/redirect.component';
import {AppResolverService, AppResolverServiceFactory} from "./app-resolver.service";
import {UrebalInterceptor} from "./services/urebal.interceptor";
import {ConfigService} from "./services/config.service";
import {LoginGuardService} from "./services/login-guard.service";
import {RefreshTokenInterceptor} from "./services/refresh-token.interceptor";
import {AuthService} from "./services/auth.service";

@NgModule({
    declarations: [
        AppComponent,
        RedirectComponent
    ],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        UserModule,
        BlockUIModule.forRoot(),
        DragulaModule.forRoot(),
        AppRoutingModule,
    ],
    providers: [
        AuthService,
        ConfigService,
        UserService,
        URebalService,
        AuthGuardService,
        LoginGuardService,
        DataImportService,
        ErrorLogService,
        AppConfig,
        PermissionResolverService,
        UrebalPermissions,
        AppResolverService,
        [
            {provide: HTTP_INTERCEPTORS, useClass: UrebalInterceptor, multi: true},
            {provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true}
        ],
        {
            provide: APP_INITIALIZER,
            useFactory: AppResolverServiceFactory,
            deps: [ConfigService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}