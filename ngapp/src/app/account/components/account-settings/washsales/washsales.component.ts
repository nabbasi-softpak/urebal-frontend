import { Component, Inject, ViewChild } from '@angular/core';
import {UrebalGridComponent} from "../../../../shared/components/urebal-grid/urebal-grid.component";

import { AccountService} from '../../../account.service';
import {UrebalPermissions, PermissionResolverService} from '../../../../services/permission-resolver.service';

@Component({
  selector: 'app-washsales',
  templateUrl: './washsales.component.html'
})
export class WashsalesComponent extends UrebalPermissions {

  @ViewChild(UrebalGridComponent) grid:UrebalGridComponent;

  accountWashsales:any = [];
  accountId:string;
  randomText:string;

  constructor(private accountService:AccountService,
              permissionResolverService: PermissionResolverService) {
    super(permissionResolverService);
    this.randomText = Math.random().toString(36).substr(2, 9);
  }

  loadWashsale(id) {
    this.accountWashsales = [];
    this.accountId = id;
    this.accountService.getWashSales(this.accountId)
      .subscribe((result) => {
        if(result.code == 200){
          this.accountWashsales = result.responsedata;
        }else {
          this.accountWashsales = [];
        }

        this.grid.jqxGrid.showemptyrow(true);
        this.grid.refreshGrid(this.accountWashsales);


      });
  }
}
