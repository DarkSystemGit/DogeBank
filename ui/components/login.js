import { LitElement, html,css } from "lit";
import { importedStyle } from "./util.js";
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
                    <div class="field label border round center">
                        <input type="text" />
                        <label>Username</label>
                    </div>
                    <div class="field label border round center">
                        <input type="password" />
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
    login(){
        console.log(this)
        this.querySelector('')
    }
}

