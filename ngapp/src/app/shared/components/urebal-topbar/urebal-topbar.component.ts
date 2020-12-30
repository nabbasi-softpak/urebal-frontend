import { Component, OnInit } from '@angular/core';
import {UrebalPermissions, PermissionResolverService} from '../../../services/permission-resolver.service';
import {UserService} from "../../../user/user.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "angular-2-local-storage";
import {URebalService} from "../../../services/urebal.service";
import {SecureComponent} from "../../../secure/secure.component";


@Component({
  selector: 'urebal-topbar',
  templateUrl: './urebal-topbar.component.html',
  styleUrls: ['./urebal-topbar.component.css']
})
export class UrebalTopBarComponent implements OnInit{

  constructor(permissionResolverService: PermissionResolverService,
              public urebalService : URebalService,
              public userService : UserService,
              public localStorage: LocalStorageService) { }

  ngOnInit(){

    let hideNavigation = "hideNavigation";
    $('#hideNavigation').css("display", this.urebalService.config(hideNavigation));
  }
}
