import { Injectable } from '@angular/core';
import {URebalService} from "./urebal.service";
import {FirmConfig} from "../shared/util/config";

@Injectable({providedIn : "root"})
export class FirmConfigService {

  private GET_FIRM_CONFIGURATION = "firm/configuration";

  constructor(private uRebalService: URebalService) {
  }

  loadFirmConfiguration() {
  return  this.uRebalService.get(this.GET_FIRM_CONFIGURATION).toPromise()
    .then((result: any) => {
      if (result) {

        Object.assign(FirmConfig, result.responsedata);
        //console.log(FirmConfig);
      }
    });
  }
}
