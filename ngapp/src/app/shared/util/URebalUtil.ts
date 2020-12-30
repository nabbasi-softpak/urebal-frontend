export class URebalUtil {
    static encodeparams(params: string) {
        return encodeURIComponent(btoa(params));
    }

    static decodeparams(params: string) {
        return atob(decodeURIComponent(params));
    }

    static isEmptyObject(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    static numberOnlyEvent() {
        // Ref: https://jsfiddle.net/emkey08/zgvtjc51
        const bodySelector = $('body');
        // const events = "input keydown keyup mousedown mouseup select contextmenu drop";
        const events = "input keyup select contextmenu drop";

        bodySelector.on(events, '.floating-number-three-decimals, .floating-number-three-decimals > input',
            allowFloatingNumberThreeDecimal);

        bodySelector.on(events, '.floating-number-two-decimals, .floating-number-two-decimals > input',
            allowFloatingNumberTwoDecimal);

        bodySelector.on(events, '.percent-three-decimals, .percent-three-decimals > input',
            allowPercentThreeDecimal);

        bodySelector.on(events, '.dollar-three-decimals, .dollar-three-decimals > input',
            allowDollarThreeDecimal);
    }

    static addJqxGridClassCellName(className) {
        return (row: number, columnfield: any, value: number, rowdata) => className;
    }

    static getObjectKeys(object) {
        return Object.keys(object);
    }


    static corsCheck(error) {
        if (typeof error['response'] === 'undefined' && error.status == 0) {
            const message = error.name + ': This could be a CORS issue or a dropped internet connection. Please contact administrator.';

            // Refresh page after showing alert (https://stackoverflow.com/a/19664956/1335825)
            // @ts-ignore
            if(!alert(message)){window.location.reload();}
        }
    }
}

export const numericalEventHandler = (event, inputFilter) => {
    let t = event.target;
    if (inputFilter(t.value)) {
        t.oldValue = t.value;
        t.oldSelectionStart = t.selectionStart;
        t.oldSelectionEnd = t.selectionEnd;
    } else if (t.hasOwnProperty("oldValue")) {
        t.value = inputFilter(t.oldValue) ? t.oldValue : "";
        t.setSelectionRange(t.oldSelectionStart, t.oldSelectionEnd);
    }

    return new Promise((resolve, reject) => resolve());
};

export const allowFloatingNumberThreeDecimal = (event) => {
    return numericalEventHandler(event, (value) => {
        return /^-?[,\d]*\.?\d{0,3}$/.test(value);
    });
};

export const allowFloatingNumberTwoDecimal = (event) => {
    return numericalEventHandler(event, (value) => {
        return /^-?[,\d]*\.?\d{0,2}$/.test(value);
    });
};

export const allowPercentTwoDecimal = (event) => {
    return numericalEventHandler(event, (value) => {
        if(value > 100){
            return false;
        }
        return /^([0-9]|[1-8][0-9]|9[0-9]|99)[.,]?\d{0,2}$/.test(value); // 0-100 with 2 decimal (i.e. 99.99 or 100)
    });
};

export const allowPercentThreeDecimal = (event) => {
    return numericalEventHandler(event, (value) => {
        return /^([0-9]|[1-8][0-9]|9[0-9]|100)[.,]?\d{0,3}$/.test(value); // 0-100 with 3 decimal
    });
};

export const allowPercentNoDecimal = (event) => {
    return numericalEventHandler(event, (value) => {
        return /^([0-9]|[1-8][0-9]|9[0-9]|100)$/.test(value); // 0-100 with 3 decimal
    });
};

export const allowDollarThreeDecimal = (event) => {
    return numericalEventHandler(event, (value) => {
        return /^\d{0,12}([.]\d{0,3})?$/.test(value);
    });
};

