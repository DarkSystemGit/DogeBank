import { LitElement, html, css, render } from "lit";
import { importedStyle, redirect,read } from "./util.js";
import { RPC } from "../rpc.js";
export class CAccount extends LitElement {
    static styles = css`
        .pos {
            transform: translateY(20%);
        }
        .hid{
            display:none;
        }
    `;
    static properties = {};
    constructor() {
        super();
    }
    
    // Render the UI as a function of component state
    render() {
        return html`
            ${importedStyle(document)}
            <div id="body">${this._template(this)}</div>
        `;
    }
    _template(obj) {
        return html`<article class="round pos">
            <div class="center">
                <h1 class="center-align center">Your Account</h1>
                <div class="padding"></div>
                <div>
                    <img
                        class="circle extra center"
                        alt="profile pic"
                        src="img/AddProfile.svg"
                        id="prof"
                        style="width:12.5%;height:12.5%;"
                    />
                    <input @change="${this.img}" type="file" accept="image/*" id="fileInput">
                </div>
                
                
                <div class="field label border round jsinput" id="jun">
                    <input
                        type="text"
                        id="login-username"
                        value="${obj.name}"
                        placeholder=" "
                    />
                    <label>Username</label>
                </div>
                <div class="field label border round jsinput" id="jpasswd">
                    <input type="password" id="login-passwd" placeholder=" " />
                    <label>Password</label>
                </div>
                <div class="field label border round jsinput" id="jpasswd">
                    <input
                        type="email"
                        id="login-email"
                        value="${obj.email}"
                        placeholder=" "
                    />
                    <label>Email</label>
                </div>
                <nav>
                    <button class="responsive" @click="${this._create}">
                        Create
                    </button>
                </nav>
            </div>
        </article>`;
    }
    async img(){
        var prof=await read(this.shadowRoot.getElementById('fileInput').files[0])
        this.shadowRoot.getElementById('prof').src=prof
    }
    async _create() {
        var prof=await read(this.shadowRoot.getElementById('fileInput').files[0])
        var fields={
            profile:prof,
            passwd:this.shadowRoot.getElementById('login-passwd').value,
            email:this.shadowRoot.getElementById('login-email').value,
            name:this.shadowRoot.getElementById('login-username').value
        }
        var rpc = new RPC();
        var conn = await rpc.createChannel(
            window.location.hostname,
            parseInt(window.location.port),
            window.location.protocol == "https:",
        );
        await rpc.sendMsg(conn,'createUser',fields.name,fields.passwd,fields.email,fields.profile)
        rpc.close(conn);
        redirect("login");
    }
}
