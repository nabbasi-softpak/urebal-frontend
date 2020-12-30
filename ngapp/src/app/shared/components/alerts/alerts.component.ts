import { Component, OnInit } from '@angular/core';
import {ErrorLogService} from "../../../error-log.service";
import {URebalService} from "../../../services/urebal.service";


@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  show = false;
  constructor(public urebalService: URebalService, private errorLogService: ErrorLogService) {
   /* this.errorLogService.getError().subscribe( (value) => {
      //console.log('Alert Trigger:', value);
      this.show = value;      // uncomment this then need to display error alert across the application
    } );*/
  }

  ngOnInit() {
  }

  close(){
    //this.errorLogService.dismissError();
  }

}
