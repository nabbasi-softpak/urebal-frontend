/**
 * Created by moazzam.qaisar on 12/4/2017.
 */
import {NgBlockUI, BlockUI} from "ng-block-ui";

export class UILoader {
    @BlockUI() static blockUI: NgBlockUI;

    private static list: Array<object> = Array();
    private static timerId: any = undefined;

    static start(message) {
        UILoader.blockUI.start(message);
    }

    static registerService(data: object) {
        UILoader.list.push(data);
    }

    static unregisterAllServices() {
        UILoader.list.splice(0, UILoader.list.length);
    }

    static unregisterService(data: object) {
        let index = UILoader.list.findIndex((value) => {
            return value == data
        });

        if (index != -1) {
            UILoader.list.splice(index, 1);
        }
    }

    static stop() {
        if (UILoader.timerId == undefined) {
            UILoader.timerId = setInterval(function () {
                if (UILoader.list.length == 0) {
                    UILoader.blockUI.stop();
                    clearInterval(UILoader.timerId);
                    UILoader.timerId = undefined;
                }
            }, 500);
        }
    }
}
