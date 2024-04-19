import { LitElement, html } from "lit";
import { importedStyle } from './util.js'
export class Navbar extends LitElement {
    static properties = {
        links: {},
    };


    constructor() {
        super();
        // Declare reactive properties
        this.links = { bank: '/bank', stocks: '/stocks', shop: '/shop', account: '/account' };
    }

    // Render the UI as a function of component state
    render() {

        return html`
        ${importedStyle(document)}
    <nav class="left m l surface-variant round large-blur min">
        <header class="top-padding"><img src="/img/LogoSmall.png" alt="logo" class="round large"></img></header>
        <a href="${this.links.bank}">
            <i class="fa-solid fa-building-columns"></i>
            <p>Bank</p>
        </a>
        <a href="${this.links.stocks}">
            <i class="fa-solid fa-arrow-trend-up"></i>
            <p>Stocks</p>
        </a>
        <a href="${this.links.shop}">
            <i class="fa-solid fa-bag-shopping"></i>
            <p>Shop</p>
        </a>
        <a href="${this.links.account}">
            <i class="fa-solid fa-circle-user"></i>
            <p>Account</p>
        </a>
    </nav>
    <main class="responsive"><slot></slot></main>
    
    `;

    }
}
