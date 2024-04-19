import { unsafeHTML } from 'lit-html/directives/unsafe-html';
export function importedStyle(document){
    var style='';
        Array.from(document.getElementsByTagName('link')).forEach(elm=>{
            if(elm.getAttribute('rel')=="stylesheet"){style+=elm.outerHTML}
        })
        return unsafeHTML(style)
}