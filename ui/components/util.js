import { unsafeHTML } from 'lit-html/directives/unsafe-html';
export function importedStyle(document){
    var style='';
    
        Array.from(document.getElementsByTagName('link')).concat(Array.from(document.getElementsByTagName('style'))).forEach(elm=>{
            
            if((elm.getAttribute('rel')=="stylesheet")||(elm.tagName=="STYLE")){style+=elm.outerHTML}
        })
        return unsafeHTML(style)
}
export function redirect(page){
    if(sessionStorage.getItem('session')!=null||['cuser','login'].includes(page)){
    var body=document.getElementsByTagName('nav-bar')[0]
    body.innerHTML=''
    body.appendChild(document.createElement('page-'+page))
}else{
    var body=document.getElementsByTagName('nav-bar')[0]
    body.innerHTML=''
    body.appendChild(document.createElement('page-404'))
}
}
export function promisify(func){
    return ()=>{return new Promise(func)}
}
export async function read(file){
    try{
    const FR = new FileReader();
    
    var read=promisify((resolve)=>FR.addEventListener("load", function(evt) {
      resolve(evt.target.result);
    })); 
      
    FR.readAsDataURL(file);
    return await read()}catch{return undefined}    
}
export function awaitValue(condition){
    return new Promise((resolve, reject) => {
        var int=setInterval(()=>{if(condition()){clearInterval(int);resolve()}})
    })
}