# pasta-date
Making it easier to paste what people actually copy into a date input.

By default inputs of type date only accept YYYY-MM-DD formatted strings, this script is a set of handlers to intercept and reformat for a known locale.

```document.addEventListener('paste',copy.pasteHandler );```
```document.addEventListener('copy',copy.copyHandler );```
```<input type="date" value="" data-date-paste="en-GB" >```

Currently translates DD/MM/YY to YYYY-MM-DD on paste.

## TODOs

- Allow registration of outbound handlers.
