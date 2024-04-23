import { LitElement, html, css, render } from "lit";
import { when } from "lit/directives/when.js";
import { importedStyle,redirect } from "./util.js";
import { RPC } from "../rpc.js";
export class Bank extends LitElement {
    static styles = css`
        .comp {
            padding: 1rem;
        }
    `;
    static properties = {
        balance: 300,
    };

    constructor() {
        super();
        document.body.style.backgroundImage = 'url("img/BankBackground.svg")';
        document.body.style.backgroundSize = "cover";
        document
            .getElementsByTagName("nav-bar")[0]
            .classList.add("transparent");

        this.balance = 0;
    }

    // Render the UI as a function of component state
    render() {
        this.dataPull();
        return html`<div id="body">
            ${this._template("Loading...", "Loading...", "loading")}
        </div>`;
    }
    async dataPull() {
        var rpc = new RPC();
        var conn = await rpc.createChannel(
            window.location.hostname,
            parseInt(window.location.port),
            window.location.protocol == "https:",
        );
        var user = await rpc.sendMsg(
            conn,
            "getUser",
            sessionStorage.getItem("session"),
        );
        this.balance = user.balance;
        if (this.balance % 1 != 0) {
            this.balance = this.balance.toString();
        } else {
            this.balance = this.balance.toString() + ".00";
        }
        this.payments = user.payments.map((elm) =>
            this.generatePurchase(elm.company, elm.amount, elm.status),
        );
        
        if (this.shadowRoot.getElementById("loading"))
            this.shadowRoot.getElementById("loading").remove();
        render(
            this._template("$" + this.balance, this.payments, ""),
            this.shadowRoot.getElementById("body"),
        );
    }
    _template(balance, payments, id) {
        return html`
            ${importedStyle(document)}
            <div id="${id}">
                <div class="field large prefix round fill">
                    <i class="front">search</i>
                    <input @click="${this.search}" id="search" />
                </div>
                <div class="comp">
                    <h1>Balance</h1>
                    <div style="display:flex;">
                        <h1>${balance}</h1>
                        <button
                            @click="${this.addBalance}"
                            class="circle extra primary"
                            style="transform: translateY(20%);"
                        >
                            <i>add</i>
                        </button>
                    </div>
                    <div class="padding"></div>
                    <h1>Recent Transactions</h1>
                    ${payments}
                </div>
            </div>
        `;
    }
    generatePurchase(company, amount, status) {
        return html`
            <article style="width:50%;">
                <div class="row">
                    <img
                        style="width:10%"
                        src="img/${status ? "Check" : "Invalid"}.svg"
                    />
                    <div class="max">
                        <h5>${when(parseFloat(amount) < 0,() => html`To:`,() => html`From:`)} ${company}</h5>
                        ${this.genAmount(amount)}
                    </div>
                </div>
            </article>
        `;
    }
    genAmount(amount) {
        if (parseFloat(amount) < 0) return html`<h5 style="color:#ffb4ab;">-$${amount}</h5>`
        return html`<h5 style="color:#9ed75b;">
            +$${amount}
        </h5>`;
    }
    search(){
        var val=this.shadowRoot.getElementById('search').value
        console.log(val)
    }
    addBalance() { 
        redirect('addBalance')
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.body.style.backgroundImage = "";
        document.body.style.backgroundSize = "";
        document
            .getElementsByTagName("nav-bar")[0]
            .classList.remove("transparent");
    }
}
