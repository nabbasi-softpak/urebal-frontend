import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MessageModalComponent} from "../message-modal/message-modal.component";
import {DialogModalComponent} from "../dialog-modal/dialog-modal.component";
import {Message} from "@angular/compiler/src/i18n/i18n_ast";
import {NotificationService} from "./notification.service";

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
    @ViewChild('refMessageModal', {static: true}) messageModal: MessageModalComponent;
    private okMethod: (event) => {} = null;

    constructor(private notificationService: NotificationService) {
    }

    ngOnInit() {
        // Set modal to service on load
        this.notificationService.setMessageModalRef(this.messageModal);
        this.notificationService.setNotificationRef(this);
    }

    ok(event) {
        this.okMethod(event);
    }

    setOKMethod(method) {
        this.okMethod = method;
    }
}
