import { LitElement, css, html } from 'lit';

export class Navbar extends LitElement {
    static properties = {
        name: {},
    };
    // Define scoped styles right with your component, in plain CSS
    static styles = css`
    :host {
      color: blue;
    }
  `;

    constructor() {
        super();
        // Declare reactive properties
        this.links = {};
    }

    // Render the UI as a function of component state
    render() {
        return html`
    <nav class="left m l medium-space">
        <img src="./imgs/roundedLogo.png" alt="logo"></img>
        <a href="${this.links.bank}"></a>>
            <i class="fa-solid fa-building-columns"></i>
            <p>Bank</p>
        </a>
        <a href="${this.links.stocks}"></a>>
            <i class="fa-solid fa-arrow-trend-up"></i>
            <p>Stocks</p>
        </a>
        <a href="${this.links.shop}"></a>>
            <i class="fa-solid fa-bag-shopping"></i>
            <p>Shop</p>
        </a>
        <a href="${this.links.account}"></a>>
            <i class="fa-solid fa-circle-user"></i>
            <p>Account</p>
        </a>
    </nav>
    <button>  
    <i class="fa-solid fa-bars"></i>
    <menu>
        <a>Item 1</a>
        <a>Item 2</a>
        <a>Item 3</a>
    </menu>
</button>
    `;

    }
}