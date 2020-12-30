export const columnHeaderRenderer = (defaultText, alignment, height) => {
    return `<div style="text-align: center; margin: 1px 0 0 0px;  position: absolute;  top: 50%;  left: 50%;  -ms-transform: translate(-50%, -50%);  transform: translate(-50%, -50%);">${defaultText}</div>`;
};

export const defaultCellRenderer = (type: string, row?: number, columnfield?: string, value?: any, defaulthtml?: string, columnproperties?: any, rowdata?: any): string => {
    if (type === "string") {
        return defaultStringCellRenderer.call(this, row, columnfield, value, defaulthtml, columnproperties, rowdata);
    } else if (type === "number") {
        return defaultNumberCellRenderer.call(this, row, columnfield, value, defaulthtml, columnproperties, rowdata);
    } else if (type === "date" && value === '') {
        return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8.5px;" title="--">--</div>';
    }
    return defaulthtml;
}

export const LinkRenderer = (component, linkHandler, linkURL, row, datafield, value, defaulthtml, columnproperties, rowdata) => {
    let linkId = `${datafield}-link-id-${Math.floor((Math.random() * 1000000) + 1)}`;
    let href = (linkURL == undefined) ? '' : `href="${linkURL}"`;
    $('body').on('click', '#' + linkId, linkHandler.bind(component, rowdata));
    return $(defaulthtml).html(`<a ${href} id="${linkId}">${value}</a>`).prop('outerHTML');
}

export const ImageRenderer = (imagename: string, imagetitle: string, imageclass: string, row, datafield, value, defaulthtml, columnproperties, rowdata) => {
    return `<div style="width: 100%; height: 100%;" title="${imagetitle}"><i class="material-icons ${imageclass}">${imagename}</i></div>`;
}


const defaultStringCellRenderer = (row?: number, columnfield?: string, value?: any, defaulthtml?: string, columnproperties?: any, rowdata?: any): string => {
    let cellsalign = columnproperties.cellsalign == 'center' ? 'middle' : columnproperties.cellsalign;
    if (value === '')
        return `<div class="jqx-grid-cell-${cellsalign}-align" style="margin-top: 8.5px;" title="--">--</div>`;
}

const defaultNumberCellRenderer = (row?: number, columnfield?: string, value?: any, defaulthtml?: string, columnproperties?: any, rowdata?: any): string => {
    if (value === '') {
        return `<div class="jqx-grid-cell-right-align" style="margin-top: 8.5px;" title="--">--</div>`;
    } else if (value != '' && columnproperties.cellsformat == '') {
        return `<div class="jqx-grid-cell-right-align" style="margin-top: 8.5px;" title="${value}">${value.toLocaleString(
            undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>`;
    } else if (value != '' || value == 0) {
        return `<div class="jqx-grid-cell-right-align" style="margin-top: 8.5px;" title="${$(defaulthtml)
        .prop('innerHTML')}">${$(defaulthtml).prop('innerHTML')}</div>`;
    }
}