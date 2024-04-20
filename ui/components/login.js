import { LitElement, html, css } from "lit";
import { importedStyle,redirect } from "./util.js";
import { RPC } from "../rpc.js";
import "./gsignin.js";
export class Login extends LitElement {
    static styles = css`
    .pos{
        transform: translateY(20%);
    }
    `
    static properties={
        redirect:""
    }
    constructor() {
        super();
        this.redirect="bank"
    }

    // Render the UI as a function of component state
    render() {
        return html`
            ${importedStyle(document)}
            <article class="round pos">
                <div class="center">
                    <h1 class="center-align center">Login</h1>
                    <div class="padding"></div>
                    <img class="circle extra center" alt="profile pic" src="img/profile.svg" style="width:12.5%;height:12.5%;">
                    <div class="field label border round jsinput" id="jun">
                        <input @click="${this.clearInputs}" type="text" id="login-username" placeholder=" "/>
                        <label>Username</label>
                    </div>
                    <div class="field label border round jsinput" id="jpasswd">
                        <input @click="${this.clearInputs}" type="password" id="login-passwd" placeholder=" "/>
                        <label>Password</label>
                    </div>
                    <nav>
                        <button class="responsive" @click="${this.login}">Continue</button>
                    </nav>
                    <div class="large-divider"></div>
                    <g-signin></g-signin>
                </div>
            </article>
        `;
    }
    async login() {
        var getField = (f) => { return this.shadowRoot.getElementById('login-' + f).value }
        var rpc = new RPC()
        var conn = await rpc.createChannel(window.location.hostname, parseInt(window.location.port), window.location.protocol == "https:")
        var login = await rpc.sendMsg(conn, 'login', getField('username'), getField('passwd'))
        if (typeof login == "string") {
            sessionStorage.setItem('session', login)
            redirect(this.redirect)
        } else {
            if (!login[0]) this.shadowRoot.getElementById('jun').classList.add('invalid')
            if (!login[1]) this.shadowRoot.getElementById('jpasswd').classList.add('invalid')
        }
    }
    clearInputs() {
        Array.from(this.shadowRoot.querySelectorAll('.jsinput')).forEach(elm => elm.classList.remove('invalid'))

    }
}

