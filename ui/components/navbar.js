import { LitElement, html } from "lit";
import { importedStyle,redirect } from './util.js'

export class Navbar extends LitElement {
    static properties = {
        links: {},
    };


    constructor() {
        super();
        // Declare reactive properties
        this.links = { bank: 'bank', stocks: 'stocks', shop: 'shop', account: 'account' };
        this.reds=[
            function(){redirect(this.links.bank)},
            function(){redirect(this.links.stocks)},
            function(){redirect(this.links.shop)},
            function(){redirect(this.links.account)}
        ]
    }

    // Render the UI as a function of component state
    render() {

        return html`
        ${importedStyle(document)}
    <nav class="left m l surface-variant round large-blur min">
        <header class="top-padding"><img src="/img/LogoSmall.png" alt="logo" class="round large"></img></header>
        <a @click="${this.reds[0]}">
            <i class="fa-solid fa-building-columns"></i>
            <p>Bank</p>
        </a>
        <a @click="${this.reds[1]}">
            <i class="fa-solid fa-arrow-trend-up"></i>
            <p>Stocks</p>
        </a>
        <a @click="${this.reds[2]}">
            <i class="fa-solid fa-bag-shopping"></i>
            <p>Shop</p>
        </a>
        <a @click="${this.reds[3]}">
            <i class="fa-solid fa-circle-user"></i>
            <p>Account</p>
        </a>
    </nav>
    <main class="responsive max"><slot></slot></main>
    
    `;

    }
}
