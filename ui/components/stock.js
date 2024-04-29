import { LitElement, html } from "lit";
import { importedStyle,redirect } from './util.js'
import { createChart } from 'lightweight-charts';
function chart(data,line){
    const res=document.createDocumentFragment()
    const chart=createChart(res)
    const disp=chart.addBaselineSeries({ baseValue: { type: 'price', price: line }, topLineColor: 'rgba( 38, 166, 154, 1)', topFillColor1: 'rgba( 38, 166, 154, 0.28)', topFillColor2: 'rgba( 38, 166, 154, 0.05)', bottomLineColor: 'rgba( 239, 83, 80, 1)', bottomFillColor1: 'rgba( 239, 83, 80, 0.05)', bottomFillColor2: 'rgba( 239, 83, 80, 0.28)' });
    disp.setData(data)
    chart.timeScale().fitContent()
    return [res,chart]
}
export class Navbar extends LitElement {
    static properties = {

    };


    constructor() {
        super();

        
    }

    // Render the UI as a function of component state
    render() {

        return html`
        ${importedStyle(document)}
        <article class="round">
  <div class="row">
    <img class="circle large" src="${this.logo}">
    <div>
    <div class="max">
      <h5>${this.name}</h5>
      <p>$${this.value} ${this.change}</p>
    </div>
    
</div>
  </div>
  <nav>
    <button>Details</button>
  </nav>
</article>

    
    `;

    }
}
