'use strict'
const copy = require('../src/pasta');

function getMockEvent(type , value ){
    type = type || 'copy';
    value = value || '2021-07-22'
    let event = new Event(type, { bubbles: true, cancelable: true })
    let clipboardDataValue = value;
    event.clipboardData = {
        setData (type, value) {
           clipboardDataValue = value;
        },
        getData(type) {
           return clipboardDataValue; 
        }
      }
    return event;
}

test('Reformat DD/MM/YY for paste to YYYY-MM-DD', () => {
    expect(copy.reformatInbound('10/06/20', 'en-GB')).toBe('2020-06-10');
    expect(copy.reformatInbound('10/06/2020', 'en-GB')).toBe('2020-06-10');

    expect(copy.reformatInbound('1/6/20', 'en-GB')).toBe('2020-06-01');
    expect(copy.reformatInbound('1/6/2020', 'en-GB')).toBe('2020-06-01');

    expect(copy.reformatInbound('1/06/2020', 'en-GB')).toBe('2020-06-01');

    expect(copy.reformatInbound('01/6/2020', 'en-GB')).toBe('2020-06-01');

    expect(copy.reformatInbound('2020-12-06',null)).toBe('2020-12-06');
    expect(copy.reformatInbound('lizard',null)).toBe('lizard');

});

test('Reformat copied data from YYYY-MM-DD to DD/MM/YY', () => {
    expect(copy.reformatOutbound('2020-12-06', 'en-GB')).toBe('06/12/2020');

    expect(copy.reformatOutbound('2020-12-06',null)).toBe('2020-12-06');
    expect(copy.reformatOutbound('lizard',null)).toBe('lizard');
    
})

test('Test copy event', () => {
    
    document.body.innerHTML = `<input type="date" value="2021-07-22" data-date-paste >`;

    document.addEventListener('copy',copy.copyHandler );

    let input = document.querySelector('input');

    let event = getMockEvent('copy');
    
    input.dispatchEvent(event);

    expect(event.clipboardData.getData()).toBe('22/07/2021');

});

test('Test paste event', () => {
    document.body.innerHTML = `<input type="date" value="" data-date-paste >`;

    document.addEventListener('paste',copy.pasteHandler );

    let input = document.querySelector('input');

    input.dispatchEvent(getMockEvent('paste','22/07/21'));

    expect(input.value).toBe('2021-07-22');

});

test('Test unaffected inputs paste', () => {

    document.body.innerHTML = `<input type="date" value="">`;

    document.addEventListener('paste',copy.pasteHandler );

    let input = document.querySelector('input');

    let event = getMockEvent('paste');
    event.clipboardData.setData('22/07/22')

    input.dispatchEvent(event);

    expect(input.value).toBe('');

})


test('Test unaffected inputs copy', () => {

    document.body.innerHTML = `<input type="date" value="">`;

    document.addEventListener('copy',copy.copyHandler );

    let input = document.querySelector('input');

    let event = getMockEvent('copy');

    input.dispatchEvent(event);

    expect(event.clipboardData.getData()).toBe('2021-07-22');

})