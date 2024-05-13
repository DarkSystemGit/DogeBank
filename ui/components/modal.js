import { LitElement, html, render } from "lit";
import { importedStyle } from './util.js'
import { when } from 'lit/directives/when.js';
export class Modal extends LitElement {
    static properties = {
        nav: Boolean,
        cancel:Function,
        confirm:Function
    };


    constructor() {
        super();


    }
    modal() {
        var children = this.shadowRoot.querySelector('slot').assignedNodes({ flatten: true });
        var i= document.createElement('div')
        var c=document.createElement('div')
        c.append(...children)
        if(document.getElementById('modal'))document.getElementById('modal').parentElement.remove()
        i.innerHTML=`<dialog class="modal" style="height:100%;width:95%;">
            <div id="c"></div>
            ${this.nav? `<nav class="right-align no-space">
              <button class="transparent link" id="nc">Cancel</button>
              <button class="transparent link" id="yc">Confirm</button>
            </nav>
          `:``}
          </dialog>`
          i.querySelector('#c').replaceWith(c)
          i.querySelector('#yc').addEventListener('click',(e)=>{this.confirm(this)})
          i.querySelector('#nc').addEventListener('click',(e)=>{this.cancel(this)})
        document.body.appendChild(i)

    }
    // Render the UI as a function of component state
    render() {

        return html`
        ${importedStyle(document)}
        <slot @slotchange=${this.modal} style="display:none;"></slot>
    `;
    
    }
    update(){
        super.update()
        this.modal()
    }
    toggle() {
        if(!this.togglec){document.querySelector('dialog').showModal();this.togglec=1;return}

        document.querySelector('dialog').close();
        this.togglec=0
    }

}
