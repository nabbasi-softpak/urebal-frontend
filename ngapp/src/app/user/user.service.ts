import {EventEmitter, Injectable, Injector} from '@angular/core';
import {URebalService} from '../services/urebal.service';
import {Guid} from '../shared/util/GUID';
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "angular-2-local-storage";
import {PermissionResolverService} from "../services/permission-resolver.service";
import {forkJoin, throwError} from "rxjs";
import {switchMap, tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {AppConfig} from "../../app.config";
import {FirmConfigService} from "../services/firm-config.service";

@Injectable()
export class UserService extends URebalService {

    private LOGIN_URL: string = "user/login";
    onLogin: EventEmitter<any> = new EventEmitter();

    constructor(http: HttpClient, public localStorage: LocalStorageService,
                private permissionResolverService: PermissionResolverService,
                private firmConfigService: FirmConfigService,
                private injector: Injector) {
        super(http, localStorage);
    }

    login(firm: string, username: string, password: string, captchResponse: string) {
        const formData = new FormData();
        formData.append("firmName", firm);
        formData.append("username", username);
        formData.append("password", password);
        formData.append("g-recaptcha-response", captchResponse);

        return super.postForm(this.LOGIN_URL, formData)
    }

    logout() {
        let guid = new Guid();
        super.logout(); // remove Authorization header from uRebalService

        return this.get("user/logout?q=" + guid.newGuid()).subscribe(
            response => {
                if (response.code == 200 || response.code == 401) {
                    this.localStorage.set("userFirstName", null); // This will clear userFirstName from localStorage on logout
                    this.injector.get(Router).navigate(['user/login']); // TODO: Why? Cannot resolve Router, cyclic dependency issue.
                }
            },
            error => {
                console.log(error);
            }
        );
    }


    checkOldPassword(OldPassword: string) {
        const formData = new FormData();
        formData.append("password", OldPassword);

        return super.postFormData("user/checkOldPassword", formData);
    }

    changePassword(newPassword) {
        const formData = new FormData();
        formData.append("password", newPassword);

        return super.postFormData("user/changePassword", formData);
    }

    getPasswordConfiguration() {
        return this.get("user/getConfiguration");
    }

    getUserReportLayout(reportName) {
        return this.get(`user/userReportLayout?reportName=${reportName}`)
    }

    saveUserReportLayout(reportName, reportState) {
        const formData = new FormData();
        formData.append("reportName", reportName);
        formData.append("reportState", reportState);

        return this.postFormData(`user/userReportLayout`, formData);
    }

    triggerLoginEvent(response) {
        if (response.code == 200) {
            this.onLogin.emit(response.responsedata)
        }
    }

    loadInitData() {
        return this.validateSession().pipe(switchMap((result) => {
            if (result.code == 200) {
                return forkJoin([
                    this.permissionResolverService.getPermissions(),
                    this.firmConfigService.loadFirmConfiguration(),
                    this.getUserInfo().pipe(tap(response => this.triggerLoginEvent(response)))
                ]);
            } else {
                throw throwError("Not authorized");
            }
        }));
    }

    getUserInfo() {
        return this.get("user/info");
    }

    getOIDCSignInURL(clientName) {
        return this.getServiceUrl() + `user/oauth/${clientName.toLowerCase()}`
    }
}
