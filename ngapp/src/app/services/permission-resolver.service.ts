import {Injectable} from '@angular/core';
import {Permissions} from "../../Permissions";
import {URebalService} from "../services/urebal.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class PermissionResolverService {

    GET_USERPERMISSIONS = "user/permissions";

    private permissionset = new BehaviorSubject<any[]>([]);

    constructor(private uRebalService: URebalService) {
    }

    getLoggedInUserPermissions() {
        return this.uRebalService.get(this.GET_USERPERMISSIONS);
    }

    initializeCurrentUserPermission(permissionset: any[]) {
        this.permissionset.next(permissionset);
    }

    get permissions(): BehaviorSubject<any[]> {
        return this.permissionset;
    }

    getPermissions() {
        return this
            .getLoggedInUserPermissions()
            .pipe(map(
                (data) => {
                    if (data.code == 200) {
                        /** initialize user permissions **/
                        this.initializeCurrentUserPermission(data.responsedata); // here responsedata returns the current user's permission-set
                    }
                }));
    }

}

@Injectable()
export class UrebalPermissions extends Permissions {
    private permissionset: any[];

    constructor(private permissionResolverService: PermissionResolverService) {
        super();
        this.permissionResolverService.permissions.subscribe(result => this.permissionset = result);
    }

    public isAllowed(permission: string): boolean {
        if (this.permissionset !== null && this.permissionset !== undefined && this.permissionset.length > 0) {
            return (this.permissionset.findIndex(p => p.permissionName === this.userPermissions.get(permission)) > -1);
        }
        return false;
    }

    public loadPermission(): Observable<any> {
        if (this.permissionset !== null && this.permissionset !== undefined && this.permissionset.length == 0) {
            return this.permissionResolverService.getPermissions()
        }
        return of("");
    }

}
