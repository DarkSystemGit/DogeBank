import { LitElement, html, css, render } from "lit";
import { when } from "lit/directives/when.js";
import { importedStyle, redirect } from "./util.js";
import { RPC } from "../rpc.js";
import fuzzysort from "fuzzysort";
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
        rpc.close(conn);
        this.balance = user.balance;
        if (this.balance % 1 != 0) {
            this.balance = this.balance.toString();
        } else {
            this.balance = this.balance.toString() + ".00";
        }
        this.payments = user.payments.map((elm) =>
            this.generatePurchase(elm.company, elm.amount, elm.status),
        );
        this.user = user;
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
                    <input @input="${this.__search}" id="search" />
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
                        <h5>
                            ${when(
            parseFloat(amount) < 0,
            () => html`To:`,
            () => html`From:`,
        )}
                            ${company}
                        </h5>
                        ${this.genAmount(amount)}
                    </div>
                </div>
            </article>
        `;
    }
    genAmount(amount) {
        if (parseFloat(amount) < 0)
            return html`<h5 style="color:#ffb4ab;">-$${amount}</h5>`;
        return html`<h5 style="color:#9ed75b;">+$${amount}</h5>`;
    }
    async __search() {
        if(this.value!=""){
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
        rpc.close(conn);
        var res = [];
        fuzzysort
            .go(this.value, user.payments, { key: "company", limit: 20 })
            .forEach((elm) => {
                console.log(elm);
                res.push(html`
                    <article style="width:50%;">
                        <div class="row">
                            <img
                                style="width:10%"
                                src="img/${elm.obj.status
                        ? "Check"
                        : "Invalid"}.svg"
                            />
                            <div class="max">
                                <h5>
                                    ${when(
                            parseFloat(elm.obj.amount) < 0,
                            () => html`To:`,
                            () => html`From:`,
                        )}
                                    ${elm.obj.company}
                                </h5>
                                ${((amount) => {
                        if (parseFloat(amount) < 0)
                            return html`<h5 style="color:#ffb4ab;">
                                            -$${amount}
                                        </h5>`;
                        return html`<h5 style="color:#9ed75b;">
                                        +$${amount}
                                    </h5>`;
                    })(elm.obj.amount)}
                            </div>
                        </div>
                    </article>
                `);
            });

        var doc = this.parentElement.parentElement.lastElementChild;
        doc.replaceChildren();
        var disp = document.createElement("div");
        render(html`${res}`, disp);
        if (disp.children.length != 0) {
            doc.appendChild(disp);
        } else {
            var h1 = document.createElement("h1");
            h1.innerText = "No Transactions Found.";
            h1.style.transform = 'translate(20%,-50%)';
            doc.appendChild(h1);
        }}else{
            redirect('bank')
        }
    }
    addBalance() {
        redirect("addBalance");
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
