import { LitElement, html } from "lit";
import { importedStyle } from './util.js'
export class CompanyList extends LitElement {
    static properties = {
        comapnies: Array,
    };


    constructor() {
        super();
        //Company is an object like such {name:"companyName",value:Number,logo:"b64-encoded Image",revenue:Data}
        //Data takes the form {"year-month-day(yyyy-mm-dd)":price,...}
       //Companies is a list of the form [Company,Company,...]
       this.companies=this.companies||[]
    }

    // Render the UI as a function of component state
    render() {

        return html`
        ${importedStyle(document)}
        ${this.companies.map((c)=>{return html`<listitem-company .company=${c}></listitem-company>`})}
    `;

    }
   
}
