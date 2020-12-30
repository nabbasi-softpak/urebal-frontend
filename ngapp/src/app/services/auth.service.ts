import {Injectable} from '@angular/core';
import {AppConfig} from '../../app.config';
import {HttpClient, HttpHeaders} from "@angular/common/http";

import {IRequestOptions} from "../shared/classes/IRequestOptions.class";
import {LocalStorageService} from "angular-2-local-storage";
import {OidcClientName} from "../shared/enums/ClientName.enum";

// !!! WARNING WARNING WARNING !!!
// USE UREBAL SERVICE INSTEAD
// This Service is created for RefreshToken Interceptor, which is loaded before uRebalService get serviceUrl.

@Injectable()
export class AuthService {
    // Static because we are updating headers list on logout.
    protected static headers = new HttpHeaders();
    protected static fileHeaders = new HttpHeaders();

    constructor(protected http: HttpClient, protected localStorage: LocalStorageService) {
    }

    public removeToken() {
        this.localStorage.remove('accessToken');
        AuthService.headers = AuthService.headers.delete("Authorization");
        AuthService.fileHeaders = AuthService.fileHeaders.delete("Authorization");

        AuthService.headers = AuthService.headers.delete("X-Client-Name");
        AuthService.fileHeaders = AuthService.fileHeaders.delete("X-Client-Name");
    }

    public setToken(accessToken, clientName) {
        if (accessToken) {
            this.localStorage.set('accessToken', accessToken);
            AuthService.headers = AuthService.headers.set("Authorization", "Bearer " + accessToken);
            AuthService.fileHeaders = AuthService.fileHeaders.set("Authorization", "Bearer " + accessToken);
        }

        if (!clientName) {
            clientName = AppConfig.DEFAULT_OIDC_CLIENT_NAME;
        }

        if (clientName) {
            this.localStorage.set('clientName', clientName);
            AuthService.headers = AuthService.headers.set("X-Client-Name", clientName);
            AuthService.fileHeaders = AuthService.fileHeaders.set("X-Client-Name", clientName);
        }
    }

    protected _setToken() {
        let token = this.getAccessToken();
        let clientName = this.localStorage.get('clientName');
        this.setToken(token, clientName);
    }

    getClientName() {
        return this.localStorage.get('clientName') || AppConfig.DEFAULT_OIDC_CLIENT_NAME;
    }

    isSSOLogin() {
        return this.getAccessToken() != null;
    }

    getAccessToken() {
        return this.localStorage.get('accessToken');
    }

    refreshSSO() {
        const options = {} as IRequestOptions;

        if (this.getClientName() == OidcClientName.BLUELEAF) {
            // We send access token to blueleaf for refreshing token.
            options.headers = AuthService.headers;
        }

        options.withCredentials = true;

        return this.http.post(AppConfig.OIDC_REFRESH_URL, null, options);
    }

    logout() {
        this.removeToken();
    }
}
