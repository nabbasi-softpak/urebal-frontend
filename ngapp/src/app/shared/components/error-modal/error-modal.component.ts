import {Component, ViewChild} from '@angular/core';
import {jqxNotificationComponent} from "@jqxSource/angular_jqxnotification";

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent  {

  @ViewChild('errorNotification') private errorNotification: jqxNotificationComponent;

  constructor() {}

  show(errorMessage: string = 'Unknown error occurred'){
    $('.jqx-notification-container').css('z-index','99999');
    $("#notificationContent").html(errorMessage);
    if(this.errorNotification.host){
      this.errorNotification.open();
    }
  }

  closeAll(){
    if(this.errorNotification.host){
      this.errorNotification.closeAll();
    }
  }
}
