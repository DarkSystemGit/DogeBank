import { unsafeHTML } from 'lit-html/directives/unsafe-html';
export function importedStyle(document){
    var style='';
        Array.from(document.getElementsByTagName('link')).forEach(elm=>{
            if(elm.getAttribute('rel')=="stylesheet"){style+=elm.outerHTML}
        })
        return unsafeHTML(style)
}
export function redirect(page){
    var body=document.getElementsByTagName('nav-bar')[0]
    body.innerHTML=''
    body.appendChild(document.createElement('page-'+page))
}