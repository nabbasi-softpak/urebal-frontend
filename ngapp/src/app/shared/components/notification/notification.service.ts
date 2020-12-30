import {Injectable} from '@angular/core';
import {MessageModalComponent} from "../message-modal/message-modal.component";
import {NotificationComponent} from "./notification.component";

@Injectable()
export class NotificationService {
    private messageModalRef: MessageModalComponent;
    private notificationRef: NotificationComponent;

    setMessageModalRef(component) {
        this.messageModalRef = component;
    }

    setNotificationRef(component) {
        this.notificationRef = component;
    }

    showDriftStatus(title = null, message = null, okMethod) {
        this.messageModalRef.title = title || "Drift Status";
        this.messageModalRef.content = message || "Drift calculation is completed.";
        this.messageModalRef.open();

        this.notificationRef.setOKMethod(okMethod);
    }

    close() {
        this.messageModalRef.close()
    }
}
