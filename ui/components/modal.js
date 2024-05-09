import { LitElement, html } from "lit";
import { importedStyle,redirect } from './util.js'

export class Modal extends LitElement {
    static properties = {
        links: {},
    };


    constructor() {
        super();
        
       
    }

    // Render the UI as a function of component state
    render() {

        return html`
        ${importedStyle(document)}
        
    `;

    }
    
}
