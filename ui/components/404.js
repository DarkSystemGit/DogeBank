import { LitElement, html } from "lit";
import { importedStyle,redirect } from './util.js'

export class ErrPage extends LitElement {
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
        <div style="height:90vh;">
            <h1 style="transform: translate(40%,30%);
">Invalid Session</h1>
            <h5 style="transform: translate(37.5%,30%);
">You seem to be loggged out, please: </h5>
<button @click="${this.red}" class="responsive" style="transform: translate(42.5%,60%);width: 50vw;">Login</button>
    </div>
    `;

    }
    red(){
        redirect('login')
    }
}
