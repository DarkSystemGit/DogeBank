import { LitElement, html,css } from "lit";
import { importedStyle } from "./util.js";
import { RPC } from "../rpc.js";
import "./gsignin.js";
export class Login extends LitElement {
    static styles = css`
    .pos{
        transform: translateY(20%);
    }
    `

    constructor() {
        super();
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
                    <div class="field label border round ">
                        <input type="text" id="login-username" placeholder=" "/>
                        <label>Username</label>
                    </div>
                    <div class="field label border round ">
                        <input type="password" id="login-passwd" placeholder=" "/>
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
    async login(){
        var getField=(f)=>{return this.shadowRoot.getElementById('login-'+f).value}
        var rpc=new RPC()
        var conn=await rpc.createChannel(window.location.hostname,parseInt(window.location.port),window.location.protocol == "https:")
        rpc.sendMsg(conn,'login',getField('username'),getField('passwd'))
    }
}

