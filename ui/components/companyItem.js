import { LitElement, html, render } from "lit";
import { importedStyle, redirect, read } from "./util.js";
import { RPC } from "../rpc.js";
function getObjItems(items,obj){
    console.log(obj)
    var r={}
    items=Object.keys(obj).filter(s=>items.includes(s))
    items.forEach((i)=>{r[i]=obj[i]})
    return r
}
export class CompanyItem extends LitElement {
    static properties = {
        //company: {type:Object,reflect:true},
    };

    constructor() {
        super();
        //Company is an object like such {name:"companyName",value:Number,logo:"b64-encoded Image",revenue:Data,stockholders:{"OwnerName":Object}}
        //Data takes the form {"year-month-day(yyyy-mm-dd)":price,...}
        this.company = this.company || {};
        this._stockholders=this.company.stockholders||[]
        console.log(this.company.stockholders,this.company)
        if(this.company.stockholders)this._stockholders=Object.keys(this.company.stockholders)
        this.data = this.company.revenue || {};
    }

    // Render the UI as a function of component state
    render() {
        if(this._stockholders.length==0)this._stockholders=Object.keys(this.company.stockholders)||[]
        return html`
            ${importedStyle(document)}
            <a
                class="round row padding surface-container wave"
                @click="${this.modal}"
            >
                <img class="round" src="${this.company.logo}" />
                <div class="max">
                    <h6 class="small">${this.company.name}</h6>
                    <div>${this.change()}</div>
                </div>
                <i>edit</i>
            </a>
            <comp-modal
                .confirm=${this.editCompany}
                .nav=${true}
                .cancel="${this.modal}"
                id="modal"
            >
                <h4 class="center">Edit ${this.company.name}</h4>
                <img
                    class="circle extra center"
                    id="prof"
                    alt="logo"
                    src=${this.company.logo}
                    style="width:12.5%;height:12.5%;"
                />
                <div class="field label border round jsinput" id="jun">
                    <input
                        type="text"
                        id="nameInput"
                        value="${this.company.name}"
                        placeholder=" "
                    />
                    <label>Name</label>
                </div>
                <div>
                    <label
                        style="white-space: nowrap;gap: .25rem;inline-size: calc(100% - 5rem);transition: all .2s;display: flex;position: absolute;inset: -1.25rem auto auto 1rem;block-size: 1rem;line-height: 1rem;font-size: .75rem;inset-inline-start: 1.5rem;"
                        >Icon</label
                    ><button
                        class="responsive
               "
                    >
                        <i>attach_file</i>
                        <span>Upload Logo</span>
                        <input
                            type="file"
                            @change="${this.logo}"
                            accept="image/*"
                        />
                    </button>
                </div>
                <div style="padding-top: 1%;">
                    <div style="display: flex;inset-inline-start: 1rem;">
                        <label style="padding-top: .5vh;font-size: 1rem;"
                            >Owners</label
                        >
                        <button class="circle small" @click="${this.addOwner}">
                            <i>add</i>
                        </button>
                    </div>
                    <div id="ownerAdder"></div>
                    <div style="padding-top: 1%;padding-left: .5%;" id="comps">
                        ${Object.values(getObjItems(this._stockholders,this.company.stockholders)).map(
                            (owner) =>
                                html`<a
                                    class="chip fill round small-elevate"
                                    @click=${this.remove}
                                >
                                    <img src="${owner.icon}" />
                                    <span>${owner.name}</span>
                                    <i>close</i>
                                </a>`,
                        )}
                    </div>
                </div>
            </comp-modal>
        `;
    }
    modal() {
        (this.shadowRoot.querySelector("comp-modal") || this).toggle();
    }
    async editCompany(t) {
        var form=t.innerNodes()
        var name=form.querySelector('#nameInput')
        var logo=this.company.logo
        var stockholders=this._stockholders
        console.table({logo,name,stockholders})
    }
    remove(t) {
        if (Object.keys(this.company.stockholders).length != 1) {
            var elm = t.target;
            var name = elm.querySelector("span").innerText;
            this._stockholders=this._stockholders.filter(item => item !== name)
            this.shadowRoot.querySelector("comp-modal").innerNodes().querySelector('#comps').replaceChildren()
            render(html`${Object.values(getObjItems(this._stockholders,this.company.stockholders)).map(
                (owner) =>
                    html`<a
                        class="chip fill round small-elevate"
                        @click=${this.remove}
                    >
                        <img src="${owner.icon}" />
                        <span>${owner.name}</span>
                        <i>close</i>
                    </a>`,
            )}`,this.shadowRoot.querySelector("comp-modal").innerNodes().querySelector('#comps'))
        }
    }
    async logo(t) {
        var file = await read(t.target.files[0]);
        var modal = this.shadowRoot.querySelector("comp-modal").innerNodes();
        this.company.logo = file;
        modal.querySelector("#prof").src = file;
    }
    change() {
        try {
            var days = Object.values(this.company.revenue).slice(-2);
            var change = days[0] - days[1];
        } catch {
            var change = 0;
        }
        if(!Number.isFinite(change))change=0
        if (change >0)
            return html`<p style="color: rgb(8, 153, 129);">
                +${parseFloat(change).toPrecision(3)}
            </p>`;
        return html`<p style="color:rgb(247, 82, 95);">
            ${parseFloat(change).toPrecision(3)}
        </p>`;
    }
    addOwner() {
        var close=()=>{this.shadowRoot.querySelector("comp-modal").innerNodes().querySelector('#ownerAdder').replaceWith((()=>{var d=document.createElement('div');d.id="ownerAdder";return d})())}
        var addOwner=async (e)=>{
            if(e.key!="Enter")return
            var elm=e.target.value
            this._stockholders.push(elm)
            close()
            render(html`${Object.values(getObjItems(this._stockholders,this.company.stockholders)).map(
                (owner) =>
                    html`<a
                        class="chip fill round small-elevate"
                        @click=${this.remove}
                    >
                        <img src="${owner.icon}" />
                        <span>${owner.name}</span>
                        <i>close</i>
                    </a>`,
            )}`,this.shadowRoot.querySelector("comp-modal").innerNodes().querySelector('#comps'))
        }
        render(html`<article style="width: 14vw;margin-top: 1vh;display: flex;left: .5vw;" id="ownerAdder">
        <div class="field label border small round fill" style="left: .5%;margin-bottom: 0%;">
            <input type="text" placeholder=" " style="" @keypress="${addOwner}">
            <label>Name</label>
        </div>
        <button class="circle error" @click="${close}">
            <i>close</i>
        </button>
    </article>`,this.shadowRoot.querySelector("comp-modal").innerNodes().querySelector("#ownerAdder"));
    }
}
