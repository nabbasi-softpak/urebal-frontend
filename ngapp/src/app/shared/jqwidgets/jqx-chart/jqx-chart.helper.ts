export const jqxFormatFunction = (value) => {
    if (value[""] == 0) return '';
    else if (value["open"]) return value["open"] + ': ' + parseFloat(value[""]).toFixed(2) + '%';
    else return '';
};

export const jqxTooltipFormatFunction = (value) => {
    if (value[""] == 0) return '';
    else if (value["open"]) return value["open"] + ': ' + parseFloat(value[""]).toFixed(2) + '%';
    else return '';
};