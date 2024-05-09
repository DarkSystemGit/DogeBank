import { LitElement, html, css, render } from "lit";
import { importedStyle, redirect } from "./util.js";
import { RPC } from "../rpc.js";
var guser;
export class Account extends LitElement {
    static styles = css`
        .pos {
            transform: translateY(20%);
        }
    `;
    static properties = {
        username: "",
        passwd: "",
    };
    constructor() {
        super();
        this.name = "Loading";
        this.email = "you@example.com";
        this.icon = "img/profile.svg";
    }

    // Render the UI as a function of component state
    render() {
        this.dataPull();
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
                <img
                    class="circle extra center"
                    id="prof"
                    alt="profile pic"
                    src=${obj.icon}
                    style="width:12.5%;height:12.5%;"
                />
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
                    <button class="responsive" @click="${this._update}">
                        Update
                    </button>
                </nav>

                <nav>
                    <button
                        class="responsive"
                        @click="${this.signout}"
                        style="background-color:#ffb4ab;color:black;"
                    >
                        Signout
                    </button>
                </nav>
                <div class="large-divider"></div>
                <h2 class="center-align center">Your Companies</h2>
                <div class="padding"></div>
                <div id="companies"></div>
                
            </div>
        </article>`;
    }
    async dataPull() {
        var rpc = new RPC();
        var conn = await rpc.createChannel(
            window.location.hostname,
            parseInt(window.location.port),
            window.location.protocol == "https:",
        );
        var user = guser = await rpc.sendMsg(
            conn,
            "getUser",
            sessionStorage.getItem("session"),
        );
        var companies=await rpc.sendMsg(
            conn,
            "getUserCompanies",
            sessionStorage.getItem("session"),
        );
        rpc.close(conn);
        var doc = this.shadowRoot.getElementById("body");
        console.log(this.shadowRoot.getElementById("companies"))
        var nocomps=html`<h5 id="companyText" class="center center-align">No companies found</h5>`
        doc.replaceChildren();
        render(this._template(user), doc);
        render(html`<list-company .companies=${companies}></list-company>`,this.shadowRoot.getElementById("companies"))
        if(companies==[])render(nocomps,this.shadowRoot.getElementById("companies"))
    }
    async signout() {
        var rpc = new RPC();
        var conn = await rpc.createChannel(
            window.location.hostname,
            parseInt(window.location.port),
            window.location.protocol == "https:",
        );
        await rpc.sendMsg(conn, "signout", sessionStorage.getItem("session"));
        redirect("login");
    }
    async _update() {
        console.log(this.parentElement.parentElement);
        var getField = (f) => {
            return this.parentElement.parentElement.querySelector("#login-" + f)
                .value;
        };
        var rpc = new RPC();
        var conn = await rpc.createChannel(
            window.location.hostname,
            parseInt(window.location.port),
            window.location.protocol == "https:",
        );
        console.log(
            sessionStorage.getItem("session"),
            getField("username"),
            getField("passwd"),
            getField("email"),
            guser.icon,
        );
        await rpc.sendMsg(
            conn,
            "editUser",
            sessionStorage.getItem("session"),
            getField("username"),
            getField("passwd"),
            getField("email"),
            guser.icon,
        );
        rpc.close(conn);
        redirect("bank");
    }
}
