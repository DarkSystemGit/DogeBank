import { LitElement, html,render } from "lit";
import { importedStyle, redirect } from "./util.js";
export class Test extends LitElement {
    static properties = {
        links: {},
    };
    constructor() {
        super();
    }
    render() {
        setTimeout(()=>this.shadowRoot.querySelector('#modal').toggle(),500)
        return html`
            <comp-modal
                .cancel=${(c) => {
                    console.log(c);
                }}
                .confirm=${(c) => {
                    console.log(c);
                }}
                .nav=${true}
                id="modal"
            >
                <h5>Title</h5>
                <p>Content of dialog</p>
            </comp-modal>
        `
        
    }
}
