
let inboundHandlers = {
    'en-GB' : dateString => {
        //normalise just in case we have DD/MM/YY or DD-MM-YY
        let cleanDateString = dateString.replaceAll('/','-');
        //check it's in a format we can work with
        if(cleanDateString.match(/\d{1,2}-\d{1,2}-\d{2,4}/)){
            let parts = cleanDateString.split('-');
            //normalise to 21st century
            if(parts[2].length==2){
                parts[2] = '20'+ parts[2]
            }
            //add leading zeros
            if(parts[0].length==1){
                parts[0] = '0'+parts[0]
            }
            if(parts[1].length==1){
                parts[1] = '0'+parts[1]
            }
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateString;
    }
}

let outboundHandlers = {
    'en-GB' : dateString => {
        let parts = dateString.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
}

function addInboundHandler(locale, func){
    if(typeof func == 'function'){
        inboundHandlers[locale]=func;
    }
}

function addOutboundHandler(locale, func){
    if(typeof func == 'function'){
        outboundHandlers[locale]=func;
    }
}

function pasteHandler(event){
    if(event.target.hasAttribute('data-date-paste')){
        let pasteContent = (event.clipboardData || window.clipboardData).getData('text');
        let locale = event.target.dataset.datePaste || "en-GB"
        date = reformatInbound(pasteContent, locale)
        event.target.value = date;
        event.preventDefault();
    }
}

function copyHandler(event){
    if(event.target.hasAttribute('data-date-paste')){
        let copyContent = (event.clipboardData || window.clipboardData).getData('text');
        let locale = event.target.dataset.datePaste || "en-GB"
        date = reformatOutbound(copyContent, locale);
        event.clipboardData.setData('text/plain', date);
        event.preventDefault();
    }
}

function reformatInbound(dateString, locale){  
    if(!!inboundHandlers[locale]){
        return inboundHandlers[locale](dateString);
    }
    //can't transform so don't
    return dateString;  
}

function reformatOutbound(dateString, locale){
    if(!!outboundHandlers[locale]){
        return outboundHandlers[locale](dateString);
    }
    return dateString;
}

exports.pasteHandler = pasteHandler;
exports.reformatInbound = reformatInbound;
exports.copyHandler = copyHandler;
exports.reformatOutbound = reformatOutbound;
exports.addInboundHandler = addInboundHandler;
exports.addOutboundHandler = addOutboundHandler;
