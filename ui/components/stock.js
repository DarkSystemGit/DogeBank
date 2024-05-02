import { LitElement, html } from "lit";
import { importedStyle, redirect } from "./util.js";
import "lit-line";
function chart(data) {
  const chart = document.createElement('lit-line');

  var list = Object.values(data)
  var color = "#089981"
  if (Math.min(...list.slice(-5)) > list.slice(-1)) color = "#f7525f"
  var chartData = []
  Object.keys(data).forEach(
    (key) => { chartData.push({ time: parseInt(key.replaceAll("-", '')), value: data[key] }) }
  )

  chart.data = [{ color, points: chartData }]
  chart.style.height="25%"
  chart.style.width="100%"
  setInterval(()=>chart.shadowRoot.querySelector('svg').setAttribute("viewBox", ""),1)
  return chart;
}
export class Stock extends LitElement {
  static properties = {
    data: { type: Object, attribute: true },
    details: { type: String, attribute: true },
    company: { type: Object, attribute: true }
  };

  constructor() {
    super();
    //data takes the form {"year-month-day(yyyy-mm-dd)":price,...}
    //details is the detailsPage
    //company is an object like such {name:"companyName",value:Number,logo:"b64-encoded Image"}
    this.data = this.data || {}
    this.details = this.details || "404"
  }

  // Render the UI as a function of component state
  render() {
    return html`
      ${importedStyle(document)}
      <article class="round" style="  min-width: 30vw;
  height: fit-content;
  max-width: fit-content;">
        <div class="row">
          <img class="circle extra" style="transform: translateY(-150%);" src="${this.company.logo}" />
          <div>
            <div class="max">
              <h2>${this.company.name}</h2>
              <div style="  display: flex;"><h5>$${parseFloat(this.company.value).toPrecision(2)}</h5> ${this.change()}</div>
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
  red() {
    redirect(this.details)
  }
  change() {
    var days = Object.values(this.data).slice(-2)
    var change = days[0] - days[1]
    console.log(change)
    if (change >= 0) return html`<h5 style="color: rgb(8, 153, 129);padding-left: 5%;
    padding-bottom: 5%;">+${parseFloat(change).toPrecision(3)}</ h5>`
    return html`<h5 style="color:rgb(247, 82, 95);padding-left: 5%;
    padding-bottom: 5%;">${parseFloat(change).toPrecision(3)}</ h5>`
  }
}
