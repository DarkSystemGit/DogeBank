import { LitElement, html, css } from "lit";
import { importedStyle } from "./util.js";
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
    async render() {
        var rpc = new RPC()
        var conn = await rpc.createChannel(window.location.hostname, parseInt(window.location.port), window.location.protocol == "https:")
        var user=await rpc.sendMsg(conn,'getUser',sessionStorage.getItem('session'))
        this.balance=user.balance
        if (this.balance % 1 != 0) {
            this.balance = this.balance.toString();
        } else {
            this.balance = this.balance.toString() + ".00";
        }
        this.payments=user.payments.map(elm=>this.generatePurchase(elm.company,elm.amount,elm.status))
        return html`
            ${importedStyle(document)}
            <div class="field large prefix round fill">
                <i class="front">search</i>
                <input />
            </div>
            <div class="comp">
                <h1>Balance</h1>
                <div style="display:flex;">
                    <h1>$${this.balance}</h1>
                    <button
                        @click="${this.addBalance}"
                        class="circle extra primary"
                        style="transform: translateY(20%);"
                    >
                        <i>add</i>
                    </button>
                </div>
                <div class="padding"></div>
                <h1>Recent Payments</h1>
                ${this.payments}
            </div>
        `;
    }
    generatePurchase(company,amount,status){
        return html`
            <article style="width:50%;">
                    <div class="row">
                        <img style="width:10%" src="img/${status ? 'Check' : 'Invalid'}.svg" />
                        <div class="max">
                            <h5>${company}</h5>
                            <h5>
                                $${amount}
                            </h5>
                        </div>
                    </div>
                </article>
        `
    }
    addBalance() { }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.body.style.backgroundImage = "";
        document.body.style.backgroundSize = "";
        document
            .getElementsByTagName("nav-bar")[0]
            .classList.remove("transparent");
    }
}
