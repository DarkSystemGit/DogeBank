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
                <h1 class="center-align center">Create Account</h1>
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

        var prof=await read(this.shadowRoot.getElementById('fileInput').files[0])||"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjMxIiBoZWlnaHQ9IjIzMSIgdmlld0JveD0iMCAwIDIzMSAyMzEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjExNS41IiBjeT0iMTE1LjUiIHI9IjExNS41IiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMl84KSIvPgo8Y2lyY2xlIGN4PSIxMTUuNSIgY3k9IjExNS41IiByPSIxMTUuNSIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMTE1LjUiIGN5PSIxMTUuNSIgcj0iMTE1LjUiIGZpbGw9IiMwNTlFRjQiIGZpbGwtb3BhY2l0eT0iMC41NyIvPgo8Y2lyY2xlIGN4PSIxMTUuNSIgY3k9Ijc4LjUiIHI9IjUzLjUiIGZpbGw9IiMwNTlFRjQiIGZpbGwtb3BhY2l0eT0iMC44Ii8+CjxjaXJjbGUgY3g9IjExNS41IiBjeT0iNzguNSIgcj0iNTMuNSIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzJfOCkiIGZpbGwtb3BhY2l0eT0iMC44Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDMgMjA1LjA0QzQ3LjQyMjYgMTY4LjM5NiA3OC42MjY3IDE0MCAxMTYuNDYzIDE0MEMxNTQuMDQyIDE0MCAxODUuMDc5IDE2OC4wMTEgMTg5LjgzMiAyMDQuMjkzQzE2OS44MDkgMjIwLjk2OSAxNDQuMDU4IDIzMSAxMTUuOTYzIDIzMUM4OC4yOTA1IDIzMSA2Mi44OTA5IDIyMS4yNjggNDMgMjA1LjA0WiIgZmlsbD0iIzA1OUVGNCIgZmlsbC1vcGFjaXR5PSIwLjgiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00MyAyMDUuMDRDNDcuNDIyNiAxNjguMzk2IDc4LjYyNjcgMTQwIDExNi40NjMgMTQwQzE1NC4wNDIgMTQwIDE4NS4wNzkgMTY4LjAxMSAxODkuODMyIDIwNC4yOTNDMTY5LjgwOSAyMjAuOTY5IDE0NC4wNTggMjMxIDExNS45NjMgMjMxQzg4LjI5MDUgMjMxIDYyLjg5MDkgMjIxLjI2OCA0MyAyMDUuMDRaIiBmaWxsPSJ1cmwoI3BhaW50Ml9saW5lYXJfMl84KSIgZmlsbC1vcGFjaXR5PSIwLjgiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8yXzgiIHgxPSIxMTUuNSIgeTE9IjAiIHgyPSIxMTUuNSIgeTI9IjIzMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSJ3aGl0ZSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNDOUM4QzgiIHN0b3Atb3BhY2l0eT0iMC45OSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MV9saW5lYXJfMl84IiB4MT0iMTE1LjUiIHkxPSIyNSIgeDI9IjExNS41IiB5Mj0iMTMyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwNTlFRjQiLz4KPHN0b3Agb2Zmc2V0PSIwLjk5OTgiIHN0b3AtY29sb3I9IiMwNTg2Q0UiIHN0b3Atb3BhY2l0eT0iMC45MiIvPgo8c3RvcCBvZmZzZXQ9IjAuOTk5OSIgc3RvcC1jb2xvcj0iIzA1OUVGNCIgc3RvcC1vcGFjaXR5PSIwLjAxNTYyNSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwNTlFRjQiIHN0b3Atb3BhY2l0eT0iMCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwNTg2Q0UiIHN0b3Atb3BhY2l0eT0iMC45NSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50Ml9saW5lYXJfMl84IiB4MT0iMTE2LjQxNiIgeTE9IjE0MCIgeDI9IjExNi40MTYiIHkyPSIyMzEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzA1OUVGNCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwNTg2Q0UiIHN0b3Atb3BhY2l0eT0iMC45NSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo="
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
