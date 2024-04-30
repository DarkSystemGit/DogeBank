import { LitElement, html } from "lit";
import { importedStyle, redirect } from "./util.js";
import { createChart } from "lightweight-charts";
function chart(data) {
  const res = document.createElement('div');
  const chart = createChart(res);
  var list=Object.values(data)
  const disp = chart.addBaselineSeries({
    baseValue: { type: "price", price: Math.min(...list.slice(-5)) },
    topLineColor: "rgba( 38, 166, 154, 1)",
    topFillColor1: "rgba( 38, 166, 154, 0.28)",
    topFillColor2: "rgba( 38, 166, 154, 0.05)",
    bottomLineColor: "rgba( 239, 83, 80, 1)",
    bottomFillColor1: "rgba( 239, 83, 80, 0.05)",
    bottomFillColor2: "rgba( 239, 83, 80, 0.28)",
  });
  var chartData=[]
  Object.keys(data).forEach(
    (key)=>chartData.push({time:key,value:data[key]})
  )
  disp.setData(chartData);
  chart.timeScale().fitContent();
  return res;
}
export class Navbar extends LitElement {
  static properties = {
    data:{type:Object,attribute:true},
    details:{type:String,attribute:true},
    name:{type:String,attribute:true},
    value:{type:Number,attribute:true},
  };

  constructor() {
    super();
    //data takes the form {"year-month-day(yyyy-mm-dd)":price,...}
    this.data=this.data||{}
    //details is the detailsPage
    this.details=this.details||"404"
  }

  // Render the UI as a function of component state
  render() {
    return html`
      ${importedStyle(document)}
      <article class="round">
        <div class="row">
          <img class="circle large" src="${this.logo}" />
          <div>
            <div class="max">
              <h5>${this.name}</h5>
              <p>$${this.value} ${this.change}</p>
            </div>
            ${chart(this.data)}
          </div>
        </div>
        <nav>
          <button @click="${this.red}">Details</button>
        </nav>
      </article>
    `;
  }
  red(){
    redirect(this.details)
  }
  change(){
    var days=Object.values(this.data).slice(-2)
    return html`${days[0]-days[1]}`
  }
}
