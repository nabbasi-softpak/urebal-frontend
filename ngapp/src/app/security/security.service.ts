import {Injectable} from '@angular/core';
import {URebalService} from '../services/urebal.service';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable()
export class SecurityService extends URebalService {

    GET_SECURITIES = "securitymaster/";
    GET_SECURITY_TYPES = "securitymaster/types";
    SECURITY_ADVANCED_SEARCH = "securitymaster/search?";

    constructor(http: HttpClient, localStorage: LocalStorageService) {
        super(http, localStorage);
    }

    public getSecurityMaster() {
        return this.get(this.GET_SECURITIES);
    }

    public getSecurityTypes() {
        return this.get(this.GET_SECURITY_TYPES);
    }

    public fetchSecuritiesByCriteria(criteria) {
        return this.get(this.SECURITY_ADVANCED_SEARCH + criteria);
    }

    public getSecurities(filterValue, limit) {
        let url: string = `securitymaster/searchSecurity?offset=0&limit=${limit}&sort=ticker:asc&filter=${encodeURIComponent(filterValue)}`;

        return this.get(url);
    }

    public searchSecurity(value, limit = 10) {
        let filterValue = `ticker:starts_with:${value}`;
            // `securityDescription:like:%${value}%`; // We need to enable FULL TEXT to use this. Otherwise relevancy of result will be confusing.
        return this.getSecurities(filterValue, limit).pipe(map(this._filterResponse));
    }

    public searchBySecurityID(securityID) {
        let filterValue = `ticker:eq:${securityID}`;
        return this.getSecurities(filterValue, 1).pipe(map(this._filterResponse));
    }

    private _filterResponse(response) {
        if (response.code == 200) return response.responsedata;
        return [];
    }
}
