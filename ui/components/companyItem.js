import { LitElement, html } from "lit";
import { importedStyle, redirect } from "./util.js";
export class CompanyItem extends LitElement {
    static properties = {
        company: Object,
    };

    constructor() {
        super();
        //Company is an object like such {name:"companyName",value:Number,logo:"b64-encoded Image",revenue:Data}
        //Data takes the form {"year-month-day(yyyy-mm-dd)":price,...}
        this.company=this.company||{}
        this.data = this.company.revenue || {}
    }

    // Render the UI as a function of component state
    render() {
        return html`
            ${importedStyle(document)}
            <a class="round row padding surface-container wave">
                <img class="round" src="${this.company.logo}" />
                <div class="max">
                    <h6 class="small">${this.company.name}</h6>
                    <div>${this.change()}</div>
                </div>
                <i @click="${this.modal}">edit</i>
            </a>
        `;
    }
    modal(){

    }
    change() {
        try{
        var days = Object.values(this.company.revenue).slice(-2)
        var change = days[0] - days[1]
        }catch{var change=0}
        if (change >= 0) return html`<p style="color: rgb(8, 153, 129);">+${parseFloat(change).toPrecision(3)}</ p>`
        return html`<p style="color:rgb(247, 82, 95);">${parseFloat(change).toPrecision(3)}</ p>`
      }
}
